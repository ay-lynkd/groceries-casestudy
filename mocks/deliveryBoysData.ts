export interface DeliveryBoy {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  profileImage?: string;
  isAvailable: boolean;
}

export const deliveryBoysData: DeliveryBoy[] = [
  { id: '1', name: 'Rahul Kumar', phoneNumber: '+91 8971267218', email: 'rahul.kumar@example.com', isAvailable: true },
  { id: '2', name: 'Rahul Singh', phoneNumber: '+91 9876543210', email: 'rahul.singh@example.com', isAvailable: true },
  { id: '3', name: 'Rakesh', phoneNumber: '+91 9123456789', email: 'rakesh@example.com', isAvailable: true },
];

export type DeliveryType = 'Self Delivery' | 'Third Party' | 'Express';
export const deliveryTypes: DeliveryType[] = ['Self Delivery', 'Third Party', 'Express'];
