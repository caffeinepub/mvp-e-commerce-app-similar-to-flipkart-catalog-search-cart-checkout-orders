import Map "mo:core/Map";
import Set "mo:core/Set";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types
  public type Product = {
    id : Nat;
    title : Text;
    description : Text;
    price : Nat;
    currency : Text;
    category : Text;
    imageUrl : Text;
    rating : ?Nat;
    stock : Nat;
  };

  type CartItem = {
    productId : Nat;
    quantity : Nat;
  };

  type Cart = {
    items : Map.Map<Nat, CartItem>;
  };

  public type PaymentMethod = {
    #cod;
  };

  public type Order = {
    id : Nat;
    user : Principal;
    timestamp : Time.Time;
    items : [CartItem];
    total : Nat;
    shippingAddress : Text;
    paymentMethod : PaymentMethod;
  };

  public type UserProfile = {
    name : Text;
  };

  /// Default comparison function using CartItem
  module CartItem {
    public func compare(cartItem1 : CartItem, cartItem2 : CartItem) : Order.Order {
      Nat.compare(cartItem1.productId, cartItem2.productId);
    };
  };

  // Helper function for explicit comparison by quantity
  module CartItemByQuantity {
    public func compareByQuantity(cartItem1 : CartItem, cartItem2 : CartItem) : Order.Order {
      Nat.compare(cartItem1.quantity, cartItem2.quantity);
    };
  };

  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Storage
  let productStore = Map.empty<Nat, Product>();
  let cartStore = Map.empty<Principal, Cart>();
  let orderStore = Map.empty<Nat, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextProductId : Nat = 1;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management - Public queries (accessible to all including guests)
  public query ({ caller }) func listAllProducts() : async [Product] {
    productStore.values().toArray();
  };

  public query ({ caller }) func listProductsByCategory(category : Text) : async [Product] {
    let filtered = productStore.values().toArray().filter(
      func(p) { p.category == category }
    );
    filtered;
  };

  public query ({ caller }) func searchProducts(keyword : Text) : async [Product] {
    let filtered = productStore.values().toArray().filter(
      func(p) { p.title.contains(#text(keyword)) or p.description.contains(#text(keyword)) }
    );
    filtered;
  };

  public query ({ caller }) func getProductById(productId : Nat) : async Product {
    switch (productStore.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?p) { p };
    };
  };

  public query ({ caller }) func getSupportedCategories() : async [Text] {
    let categories = Set.empty<Text>();
    for (product in productStore.values()) {
      categories.add(product.category);
    };
    categories.values().toArray();
  };

  // Admin-only Product Management
  public shared ({ caller }) func addProduct(
    title : Text,
    description : Text,
    price : Nat,
    currency : Text,
    category : Text,
    imageUrl : Text,
    rating : ?Nat,
    stock : Nat,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };

    let productId = nextProductId;
    nextProductId += 1;

    let product : Product = {
      id = productId;
      title;
      description;
      price;
      currency;
      category;
      imageUrl;
      rating;
      stock;
    };

    productStore.add(productId, product);
    productId;
  };

  public shared ({ caller }) func updateProduct(
    productId : Nat,
    title : Text,
    description : Text,
    price : Nat,
    currency : Text,
    category : Text,
    imageUrl : Text,
    rating : ?Nat,
    stock : Nat,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    switch (productStore.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?_) {
        let updatedProduct : Product = {
          id = productId;
          title;
          description;
          price;
          currency;
          category;
          imageUrl;
          rating;
          stock;
        };
        productStore.add(productId, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func updateStock(productId : Nat, stock : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update stock");
    };

    let product = switch (productStore.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?p) { p };
    };
    let updatedProduct = { product with stock };
    productStore.add(productId, updatedProduct);
  };

  // Cart Functionality - User-only
  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access cart");
    };
    getCartItems(caller);
  };

  public shared ({ caller }) func addItemToCart(productId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add items to cart");
    };

    let product = switch (productStore.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?p) { p };
    };
    if (quantity == 0 or quantity > product.stock) {
      Runtime.trap("Invalid quantity");
    };

    let cart = getCartByUser(caller);
    cart.items.add(
      productId,
      {
        productId;
        quantity;
      },
    );
    cartStore.add(caller, cart);
  };

  public shared ({ caller }) func updateCartItem(productId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update cart items");
    };

    let product = switch (productStore.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?p) { p };
    };
    if (quantity == 0 or quantity > product.stock) {
      Runtime.trap("Invalid quantity");
    };

    let cart = getCartByUser(caller);
    cart.items.add(
      productId,
      {
        productId;
        quantity;
      },
    );
    cartStore.add(caller, cart);
  };

  public shared ({ caller }) func removeCartItem(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove cart items");
    };

    let cart = getCartByUser(caller);
    cart.items.remove(productId);
    cartStore.add(caller, cart);
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear cart");
    };

    cartStore.add(caller, { items = Map.empty<Nat, CartItem>() });
  };

  // Order Processing - User-only
  public shared ({ caller }) func placeOrder(
    shippingAddress : Text, // Should include country information
    paymentMethod : PaymentMethod,
    country : Text, // New explicit country param
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };

    if (country != "India") {
      Runtime.trap("Order rejection: Only orders for India are accepted");
    };

    let cart = getCartByUser(caller);
    let items = cart.items.values().toArray();

    if (items.size() == 0) {
      Runtime.trap("Cart is empty");
    };

    // Validate stock availability before processing
    for (item in items.values()) {
      let product = switch (productStore.get(item.productId)) {
        case (null) { Runtime.trap("Product does not exist") };
        case (?p) { p };
      };
      if (item.quantity > product.stock) {
        Runtime.trap("Insufficient stock for product: " # product.title);
      };
    };

    let total = items.foldLeft(
      0,
      func(acc, item) {
        let product = switch (productStore.get(item.productId)) {
          case (null) { Runtime.trap("Product does not exist") };
          case (?p) { p };
        };
        acc + (product.price * item.quantity);
      },
    );

    let orderId = orderStore.size() + 1;
    let order : Order = {
      id = orderId;
      user = caller;
      timestamp = Time.now();
      items;
      total;
      shippingAddress;
      paymentMethod;
    };

    // Update stock and store order
    for (item in items.values()) {
      let product = switch (productStore.get(item.productId)) {
        case (null) { Runtime.trap("Product does not exist") };
        case (?p) { p };
      };
      let updatedProduct = { product with stock = product.stock - item.quantity };
      productStore.add(item.productId, updatedProduct);
    };

    orderStore.add(orderId, order);
    clearCartInternal(caller);

    orderId;
  };

  public query ({ caller }) func listMyOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };

    orderStore.values().toArray().filter(func(o) { o.user == caller });
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };

    let order = switch (orderStore.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?o) { o };
    };
    if (order.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only access own orders");
    };
    order;
  };

  // Utility Functions
  func getCartItems(user : Principal) : [CartItem] {
    let cart = getCartByUser(user);
    cart.items.values().toArray();
  };

  func getCartByUser(user : Principal) : Cart {
    switch (cartStore.get(user)) {
      case (null) { { items = Map.empty<Nat, CartItem>() } };
      case (?c) { c };
    };
  };

  func clearCartInternal(user : Principal) {
    cartStore.add(user, { items = Map.empty<Nat, CartItem>() });
  };
};
