# Specification

## Summary
**Goal:** Replace the current placeholder `/admin` page with a full Admin Panel product-management UI for admins, while preserving existing access control and sign-in flow.

**Planned changes:**
- Update the `/admin` route to render an Admin Panel with (1) an Add/Edit Product form and (2) a Manage Products list, instead of only displaying the signed-in principal ID.
- Keep access restricted via the existing AdminGate: non-admin users see an English “Access Denied” screen with a working “Go to Home” action; signed-out users are prompted to sign in before admin checks.
- Enhance the Add/Edit Product form to support the full backend-supported product fields (title, description, price, currency, category, imageUrl, optional rating, stock) with inline validation (English messages), imageUrl live preview (with failure state), and category suggestions from existing catalog categories while allowing free text.
- Improve the Manage Products view with English loading/empty states, per-product imageUrl thumbnail with fallback, and safer stock editing (numeric validation and no invalid/empty submissions); selecting a product to edit populates the form reliably.

**User-visible outcome:** Admin users can add, edit, and manage products (including stock updates) from a full `/admin` panel with validation, previews, and clearer states; non-admins see “Access Denied,” and signed-out users are prompted to sign in first.
