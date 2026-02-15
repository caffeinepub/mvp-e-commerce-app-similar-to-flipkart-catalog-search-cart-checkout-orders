import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ShippingAddressFormProps {
  onAddressChange: (address: string) => void;
  onCountryChange: (country: string) => void;
}

export default function ShippingAddressForm({ onAddressChange, onCountryChange }: ShippingAddressFormProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('');

  const buildAddress = (
    name: string,
    phoneNum: string,
    addr: string,
    cityVal: string,
    stateVal: string,
    pin: string,
    countryVal: string
  ) => {
    return `${name}\n${phoneNum}\n${addr}\n${cityVal}, ${stateVal} - ${pin}\n${countryVal}`;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => {
              const newName = e.target.value;
              setFullName(newName);
              onAddressChange(buildAddress(newName, phone, addressLine, city, state, pincode, country));
            }}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => {
              const newPhone = e.target.value;
              setPhone(newPhone);
              onAddressChange(buildAddress(fullName, newPhone, addressLine, city, state, pincode, country));
            }}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Textarea
          id="address"
          value={addressLine}
          onChange={(e) => {
            const newAddress = e.target.value;
            setAddressLine(newAddress);
            onAddressChange(buildAddress(fullName, phone, newAddress, city, state, pincode, country));
          }}
          placeholder="House No., Building Name, Street"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => {
              const newCity = e.target.value;
              setCity(newCity);
              onAddressChange(buildAddress(fullName, phone, addressLine, newCity, state, pincode, country));
            }}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            value={state}
            onChange={(e) => {
              const newState = e.target.value;
              setState(newState);
              onAddressChange(buildAddress(fullName, phone, addressLine, city, newState, pincode, country));
            }}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pincode">Pincode *</Label>
          <Input
            id="pincode"
            value={pincode}
            onChange={(e) => {
              const newPincode = e.target.value;
              setPincode(newPincode);
              onAddressChange(buildAddress(fullName, phone, addressLine, city, state, newPincode, country));
            }}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">Country *</Label>
        <Input
          id="country"
          value={country}
          onChange={(e) => {
            const newCountry = e.target.value;
            setCountry(newCountry);
            onCountryChange(newCountry);
            onAddressChange(buildAddress(fullName, phone, addressLine, city, state, pincode, newCountry));
          }}
          placeholder="India"
          required
        />
        <p className="text-xs text-muted-foreground">
          Currently, we only accept orders from India
        </p>
      </div>
    </div>
  );
}
