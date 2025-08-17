import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useBookingStore } from '../store/bookingStore';
import { useWallet } from '../contexts/WalletContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { useBookRoom } from '../hooks/useMutations';
import { Transaction } from '@mysten/sui/transactions';
import { useHotel, useHotelRooms } from '../hooks/useQuery';
import Input from '../components/ui/Input';
import {
  calculateNights,
  calculateSubtotal,
  calculateFees,
  calculateDiscount,
  calculateTotal,
} from '../utils/booking';
import type { Room } from '../types';


const BookSuite: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: hotel, isLoading: hotelLoading, error: hotelError } = useHotel(id as string);
  const { setCurrentBooking, setLoading, setError, loading: storeLoading, error: storeError } = useBookingStore();
  const { mutateAsync: bookRoom, isPending: bookRoomLoading } = useBookRoom();
  const { address, isConnected, client, getCoins, signTransaction, executeTransaction } = useWallet();
  const { data: rooms, isLoading: roomsLoading, error: roomsError } = useHotelRooms(id as string);


  const [formData, setFormData] = useState({
    roomId: '',
    fullName: '',
    email: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
    guests: '1',
    numRooms: '1',
    paymentCoinId: '',
  });
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof typeof formData, boolean>>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Add states to track loading status
  const [isLoadingCoins, setIsLoadingCoins] = useState(false);
  const [coinsError, setCoinsError] = useState<string>('');

  // Auto-select first available room when rooms load
  useEffect(() => {
    if (rooms && rooms.length > 0 && !formData.roomId) {
      const availableRoom = rooms.find((r: Room) => !r.is_booked);
      if (availableRoom) {
        console.log('Auto-selecting room:', availableRoom.objectId);
        setFormData((prev) => ({ ...prev, roomId: availableRoom.objectId }));
      }
    }
  }, [rooms, formData.roomId]);

  // Auto-select payment coin when wallet connects - FIXED VERSION WITH DEBUG
  useEffect(() => {
    if (isConnected && address && !formData.paymentCoinId) {
      console.log('🔍 Fetching coins for wallet:', address);
      setIsLoadingCoins(true);
      setCoinsError('');
      
      getCoins()
        .then((coins) => {
          console.log('💰 Received coins:', coins);
          console.log('💰 Coins length:', coins?.length);
          console.log('💰 First coin:', coins?.[0]);
          
          if (coins && coins.length > 0) {
            console.log('✅ Auto-selecting payment coin:', coins[0]);
            setFormData((prev) => ({ ...prev, paymentCoinId: coins[0] }));
            setCoinsError('');
          } else {
            console.log('❌ No coins available');
            setCoinsError('No SUI coins found in wallet. Please ensure you have SUI tokens.');
          }
        })
        .catch((err) => {
          console.error('💥 Failed to fetch coins:', err);
          setCoinsError(`Failed to load payment coins: ${err.message || 'Unknown error'}`);
        })
        .finally(() => {
          setIsLoadingCoins(false);
        });
    } else if (!isConnected) {
      console.log('🔗 Wallet not connected');
    } else if (!address) {
      console.log('📍 No wallet address');
    } else if (formData.paymentCoinId) {
      console.log('💳 Payment coin already selected:', formData.paymentCoinId);
    }
  }, [isConnected, address, getCoins, formData.paymentCoinId]);

  // IMPROVED VALIDATION FUNCTION
  const validateForm = () => {
    const errors: Partial<Record<keyof typeof formData, string>> = {};
    
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(formData.email)) errors.email = 'Valid email is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.checkInDate) errors.checkInDate = 'Check-in date is required';
    if (!formData.checkOutDate) errors.checkOutDate = 'Check-out date is required';
    if (formData.checkInDate && formData.checkOutDate && new Date(formData.checkInDate) >= new Date(formData.checkOutDate)) {
      errors.checkOutDate = 'Check-out must be after check-in';
    }
    if (parseInt(formData.guests) < 1) errors.guests = 'At least 1 guest is required';
    if (parseInt(formData.numRooms) < 1) errors.numRooms = 'At least 1 room is required';
    if (!formData.roomId) errors.roomId = 'Please select a room';
    
    // FIXED PAYMENT VALIDATION
    if (!isConnected) {
      errors.paymentCoinId = 'Please connect your wallet';
    } else if (isLoadingCoins) {
      errors.paymentCoinId = 'Loading payment options...';
    } else if (coinsError) {
      errors.paymentCoinId = coinsError;
    } else if (!formData.paymentCoinId) {
      errors.paymentCoinId = 'No payment coin selected';
    }
    
    setFormErrors(errors);
    const valid = Object.keys(errors).length === 0;
    setIsFormValid(valid);
    
    console.log('Form validation:', {
      valid,
      errors,
      isConnected,
      isLoadingCoins,
      coinsError,
      hasPaymentCoinId: !!formData.paymentCoinId,
      formData: {
        ...formData,
        roomId: formData.roomId ? `${formData.roomId.slice(0, 10)}...` : 'empty',
        paymentCoinId: formData.paymentCoinId ? `${formData.paymentCoinId.slice(0, 10)}...` : 'empty'
      }
    });
    
    return valid;
  };

  // Only validate when user tries to proceed, not on every change
  const handleValidation = () => {
    return validateForm();
  };

  const getNights = () => calculateNights(formData.checkInDate, formData.checkOutDate);

  const getSubtotal = () => {
    if (!rooms || !formData.roomId) return 0;
    const room = rooms.find((r: Room) => r.objectId === formData.roomId);
    const basePrice = room ? parseFloat(room.price_per_day) : 0;
    return calculateSubtotal(basePrice, getNights(), parseInt(formData.numRooms));
  };

  const getFees = () => calculateFees(getSubtotal());

  const getDiscount = () => calculateDiscount(getSubtotal());

  const calculateTotalPrice = () => {
    const subtotal = getSubtotal();
    const fees = getFees();
    const discount = getDiscount();
    return calculateTotal(subtotal, fees, discount);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Only clear error for this specific field when user starts typing
    if (touchedFields[field] && formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    
    // If field is being blurred, validate the entire form
    if (touchedFields[field]) {
      validateForm();
    }
  };

  const handleInputBlur = (field: keyof typeof formData) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    
    // Validate the entire form when a field loses focus
    validateForm();
    
    // Also validate just this field for immediate feedback
    const value = formData[field];
    let error = '';
    
    switch (field) {
      case 'fullName':
        if (!value.trim()) error = 'Full name is required';
        break;
      case 'email':
        if (!value.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(value)) error = 'Valid email is required';
        break;
      case 'phone':
        if (!value.trim()) error = 'Phone number is required';
        break;
      case 'checkInDate':
        if (!value) error = 'Check-in date is required';
        break;
      case 'checkOutDate':
        if (!value) error = 'Check-out date is required';
        else if (formData.checkInDate && new Date(formData.checkInDate) >= new Date(value)) {
          error = 'Check-out must be after check-in';
        }
        break;
      case 'guests':
        if (parseInt(value) < 1) error = 'At least 1 guest is required';
        break;
      case 'numRooms':
        if (parseInt(value) < 1) error = 'At least 1 room is required';
        break;
    }
    
    if (error) {
      setFormErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleNext = async () => {
    // Mark all fields as touched
    const allFields = Object.keys(formData) as (keyof typeof formData)[];
    setTouchedFields(allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));
    
    // If wallet is connected but coins are still loading, wait a bit
    if (isConnected && isLoadingCoins) {
      console.log('Waiting for coins to load...');
      // You could show a loading state here or wait
      setTimeout(() => {
        if (handleValidation()) {
          setIsReviewMode(true);
        }
      }, 1000);
      return;
    }
    
    if (handleValidation()) {
      setIsReviewMode(true);
    } else {
      console.log('Validation failed:', formErrors);
    }
  };

  const handleBack = () => setIsReviewMode(false);

  const handleConfirmBooking = async () => {
    if (!hotel || !formData.roomId || !address || !id) return;
    setLoading(true);
    try {
      // FIXED: Remove guests and guestAddress parameters that the API doesn't expect
      const { transactionBlock, reservationId } = await bookRoom({
        roomId: formData.roomId,
        hotelId: id,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        startDate: formData.checkInDate,
        endDate: formData.checkOutDate,
        paymentCoinId: formData.paymentCoinId,
        // Removed: guests: parseInt(formData.guests),
        // Removed: guestAddress: address,
      });
  
      const tx = Transaction.from(transactionBlock);
      const signedTx = await signTransaction({ transaction: tx });
      const txResult = await executeTransaction({
        transaction: signedTx.transactionBlockBytes,
      });
  
      const event = await client.waitForTransaction({
        digest: txResult.digest,
        options: { showEvents: true },
      });
  
      const roomBookedEvent = event.events?.find((e) =>
        e.type.endsWith('::room_booked::RoomBooked')
      ) as { parsedJson?: { reservation_id: string } } | undefined;
  
      if (!roomBookedEvent || !roomBookedEvent.parsedJson?.reservation_id) {
        throw new Error('Failed to extract reservation ID from event');
      }
  
      const newBooking = {
        id: reservationId,
        roomId: formData.roomId,
        hotelId: id,
        hotelName: hotel.name,
        guestAddress: address,
        startDate: Math.floor(new Date(formData.checkInDate).getTime() / 1000),
        endDate: Math.floor(new Date(formData.checkOutDate).getTime() / 1000),
        totalCost: calculateTotalPrice(),
        isActive: true,
      };
  
      setCurrentBooking(newBooking);
      navigate(`/bookings/${reservationId}`);
    } catch (error) {
      console.error('Booking failed:', error);
      setError('Failed to process booking');
    } finally {
      setLoading(false);
    }
  };

  if (hotelLoading || roomsLoading) {
    return <Loading message="Loading booking details..." />;
  }

  if (hotelError || roomsError || !hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: 'var(--background-primary)' }}>
        <ErrorState
          message="Hotel or rooms not found"
          onRetry={() => navigate('/hotels')}
        />
      </div>
    );
  }

  // DETERMINE BUTTON STATE
  const getButtonState = () => {
    if (!isConnected) {
      return { disabled: true, text: 'Connect Wallet to Continue' };
    }
    if (isLoadingCoins) {
      return { disabled: true, text: 'Loading Payment Options...' };
    }
    if (coinsError) {
      return { disabled: true, text: coinsError };
    }
    if (isReviewMode) {
      return { 
        disabled: storeLoading || bookRoomLoading, 
        text: storeLoading || bookRoomLoading ? 'Confirming...' : 'Confirm and Pay' 
      };
    }
    // Disable Next button if form is not valid
    return { 
      disabled: !isFormValid, 
      text: 'Next' 
    };
  };

  const buttonState = getButtonState();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background-primary)' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'var(--surface-primary)', borderColor: 'var(--border-primary)' }}>
        <div className="p-3">
          <div className="flex items-center justify-between h-16 px-2">
            <div className="flex items-center gap-4">
              <button
                onClick={isReviewMode ? handleBack : () => navigate(-1)}
                className="p-2 rounded-full transition-colors"
                style={{ backgroundColor: 'var(--surface-secondary)' }}
                aria-label="Go back"
              >
                <ArrowLeft size={20} style={{ color: 'var(--text-primary)' }} />
              </button>
              <h1 className="text-lg lg:text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {isReviewMode ? 'Review Your Booking' : 'Book Your Stay'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-4" >
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Booking Form / Summary */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hotel Info */}
            <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: 'var(--surface-primary)', borderColor: 'var(--border-primary)' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                {hotel.name}
              </h2>
              <div className="flex items-center mb-3" style={{ color: 'var(--text-secondary)' }}>
                <MapPin size={16} className="mr-2 flex-shrink-0" />
                <span className="text-sm">{hotel.physical_address}</span>
              </div>
            </div>

            {!isReviewMode ? (
              <>
                {/* Available Rooms */}
                <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: 'var(--surface-primary)', borderColor: 'var(--border-primary)' }}>
                  <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Available Rooms
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {rooms?.filter((room: Room) => !room.is_booked).map((room: Room) => (
                      <Card
                        key={room.objectId}
                        className={`p-4 cursor-pointer transition-colors ${
                          formData.roomId === room.objectId ? 'border-2 border-primary' : 'border-border-primary'
                        }`}
                        onClick={() => handleInputChange('roomId', room.objectId)}
                      >
                        <img
                          src={room.imageUrl}
                          alt={`Room ${room.objectId.slice(0, 6)}`}
                          className="w-full h-32 object-cover rounded-md mb-2"
                        />
                        <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                          Room {room.objectId.slice(0, 6)}...
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {room.price_per_day} SUI/night
                        </p>
                      </Card>
                    ))}
                    {rooms?.filter((room: Room) => !room.is_booked).length === 0 && (
                      <p className="text-center col-span-full text-text-secondary">
                        No available rooms.
                      </p>
                    )}
                  </div>
                </div>

                {/* Booking Details */}
                <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: 'var(--surface-primary)', borderColor: 'var(--border-primary)' }}>
                  <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Booking Details
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="fullName">
                        Full Name
                      </label>
                      <Input
                        id="fullName"
                        placeholder="Enter full name"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        onBlur={() => handleInputBlur('fullName')}
                        className="w-full"
                        error={touchedFields.fullName ? formErrors.fullName : undefined}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="email">
                        Email
                      </label>
                      <Input
                        id="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        onBlur={() => handleInputBlur('email')}
                        type="email"
                        className="w-full"
                        error={touchedFields.email ? formErrors.email : undefined}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="phone">
                        Phone
                      </label>
                      <Input
                        id="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        onBlur={() => handleInputBlur('phone')}
                        type="tel"
                        className="w-full"
                        error={touchedFields.phone ? formErrors.phone : undefined}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="guests">
                        Guests
                      </label>
                      <Input
                        id="guests"
                        placeholder="Number of guests"
                        value={formData.guests}
                        onChange={(e) => handleInputChange('guests', e.target.value)}
                        onBlur={() => handleInputBlur('guests')}
                        type="number"
                        min="1"
                        className="w-full"
                        error={touchedFields.guests ? formErrors.guests : undefined}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="numRooms">
                        Rooms
                      </label>
                      <Input
                        id="numRooms"
                        placeholder="Number of rooms"
                        value={formData.numRooms}
                        onChange={(e) => handleInputChange('numRooms', e.target.value)}
                        onBlur={() => handleInputBlur('numRooms')}
                        type="number"
                        min="1"
                        className="w-full"
                        error={touchedFields.numRooms ? formErrors.numRooms : undefined}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="checkInDate">
                          Check-in
                        </label>
                        <Input
                          id="checkInDate"
                          placeholder="Select date"
                          value={formData.checkInDate}
                          onChange={(e) => handleInputChange('checkInDate', e.target.value)}
                          onBlur={() => handleInputBlur('checkInDate')}
                          type="date"
                          className="w-full"
                          min={new Date().toISOString().split('T')[0]}
                          error={touchedFields.checkInDate ? formErrors.checkInDate : undefined}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="checkOutDate">
                          Check-out
                        </label>
                        <Input
                          id="checkOutDate"
                          placeholder="Select date"
                          value={formData.checkOutDate}
                          onChange={(e) => handleInputChange('checkOutDate', e.target.value)}
                          onBlur={() => handleInputBlur('checkOutDate')}
                          type="date"
                          className="w-full"
                          min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                          error={touchedFields.checkOutDate ? formErrors.checkOutDate : undefined}
                        />
                      </div>
                    </div>

                    {/* ENHANCED PAYMENT STATUS INDICATOR WITH DEBUG INFO */}
                    {/* <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--surface-secondary)' }}> */}
                      {/* <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                        Payment Status
                      </h3> */}
                      {/* {!isConnected ? (
                        <p className="text-sm text-orange-500">⚠️ Please connect your wallet</p>
                      ) : isLoadingCoins ? (
                        <p className="text-sm text-blue-500">🔄 Loading payment options...</p>
                      ) : coinsError ? (
                        <div>
                          <p className="text-sm text-red-500">❌ {coinsError}</p>
                          <button 
                            onClick={() => {
                              console.log('🔄 Manually retrying coin fetch...');
                              setIsLoadingCoins(true);
                              setCoinsError('');
                              getCoins()
                                .then((coins) => {
                                  console.log('🔄 Retry result:', coins);
                                  if (coins && coins.length > 0) {
                                    setFormData((prev) => ({ ...prev, paymentCoinId: coins[0] }));
                                    setCoinsError('');
                                  } else {
                                    setCoinsError('No SUI coins found in wallet');
                                  }
                                })
                                .catch((err) => {
                                  console.error('🔄 Retry failed:', err);
                                  setCoinsError(`Retry failed: ${err.message}`);
                                })
                                .finally(() => setIsLoadingCoins(false));
                            }}
                            className="text-xs text-blue-500 underline mt-1"
                          >
                            Retry loading coins
                          </button>
                        </div>
                      ) : formData.paymentCoinId ? (
                        <div>
                          <p className="text-sm text-green-500">✅ Payment coin selected</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Coin ID: {formData.paymentCoinId.slice(0, 10)}...
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-orange-500">⚠️ No payment coin available</p>
                      )} */}
                      
                      {/* Debug info */}
                      {/* <div className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <p>Connected: {isConnected ? '✅' : '❌'}</p>
                        <p>Address: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'None'}</p>
                        <p>Loading: {isLoadingCoins ? '⏳' : '✅'}</p>
                      </div> */}
                    {/* </div> */}
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: 'var(--surface-primary)', borderColor: 'var(--border-primary)' }}>
                <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Booking Summary
                </h2>
                <Card className="p-4 mb-4">
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Room: {formData.roomId.slice(0, 6)}...
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Dates: {formData.checkInDate} - {formData.checkOutDate}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Guests: {formData.guests} | Rooms: {formData.numRooms}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Guest: {formData.fullName} ({formData.email})
                  </p>
                </Card>
                <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Payment Details
                </h3>
                <Card className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Room Cost</p>
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{getSubtotal()} SUI</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Fees</p>
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{getFees()} SUI</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Discount</p>
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{getDiscount()} SUI</p>
                    </div>
                    <div className="flex justify-between mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-primary)' }}>
                      <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Total</p>
                      <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{calculateTotalPrice()} SUI</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
            {storeError && (
              <p className="text-red-500 text-sm mt-4 text-center">{storeError}</p>
            )}
          </div>

          {/* Sticky Action Sidebar */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="sticky top-24 ">
              <div className="bg-surface-primary p-6 shadow-lg rounded-xl space-y-6" style={{ backgroundColor: 'var(--surface-primary)', borderColor: 'var(--border-primary)' }} >
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {isReviewMode ? 'Complete Your Booking' : 'Ready to Book?'}
                  </h4>
                  <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                    {isReviewMode 
                      ? 'Confirm your booking details and complete payment securely on the blockchain.'
                      : 'Fill in your details to proceed with booking this amazing stay.'
                    }
                  </p>
                </div>

                <Button
                  onClick={isReviewMode ? handleConfirmBooking : handleNext}
                  disabled={buttonState.disabled}
                  className="w-full font-semibold"
                >
                  {buttonState.text}
                </Button>

                {isReviewMode && (
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="w-full py-3 font-semibold"
                  >
                    Back to Edit
                  </Button>
                )}

                {/* Wallet Status */}
                {!isConnected && (
                  <div className="mt-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <p className="text-orange-500 text-xs text-center">
                      Please connect your wallet to proceed with booking
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSuite;

// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { ArrowLeft, MapPin } from 'lucide-react';
// import { useBookingStore } from '../store/bookingStore';
// import { useWallet } from '../contexts/WalletContext';
// import { Button } from '../components/ui/Button';
// import { Card } from '../components/ui/Card';
// import Loading from '../components/Loading';
// import ErrorState from '../components/ErrorState';
// import { useBookRoom } from '../hooks/useMutations';
// import { Transaction } from '@mysten/sui/transactions';
// import { useHotelRooms, useHotels } from '../hooks/useQuery';
// import Input from '../components/ui/Input';
// import {
//   calculateNights,
//   calculateSubtotal,
//   calculateFees,
//   calculateDiscount,
//   calculateTotal,
// } from '../utils/booking';

// interface Room {
//   objectId: string;
//   hotel_id: string;
//   id: { id: string };
//   image_blob_id: string;
//   is_booked: boolean;
//   price_per_day: string;
//   imageUrl: string;
// }

// const BookSuite: React.FC = () => {
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();
//   const { data: hotels, isLoading: hotelLoading, error: hotelError } = useHotels();
//   const { setCurrentBooking, setLoading, setError, loading: storeLoading, error: storeError } = useBookingStore();
//   const { mutateAsync: bookRoom, isPending: bookRoomLoading } = useBookRoom();
//   const { address, isConnected, client, getCoins, signTransaction, executeTransaction } = useWallet();
//   const { data: rooms, isLoading: roomsLoading, error: roomsError } = useHotelRooms(id || '');

//   const hotel = hotels?.find((hotel) => hotel.id.id === id);

//   const [formData, setFormData] = useState({
//     roomId: '',
//     fullName: '',
//     email: '',
//     phone: '',
//     checkInDate: '',
//     checkOutDate: '',
//     guests: '1',
//     numRooms: '1',
//     paymentCoinId: '',
//   });
//   const [isReviewMode, setIsReviewMode] = useState(false);
//   const [formErrors, setFormErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
//   const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof typeof formData, boolean>>>({});
//   const [isFormValid, setIsFormValid] = useState(false);
  
//   // Add states to track loading status
//   const [isLoadingCoins, setIsLoadingCoins] = useState(false);
//   const [coinsError, setCoinsError] = useState<string>('');

//   // Auto-select first available room when rooms load
//   useEffect(() => {
//     if (rooms && rooms.length > 0 && !formData.roomId) {
//       const availableRoom = rooms.find((r: Room) => !r.is_booked);
//       if (availableRoom) {
//         console.log('Auto-selecting room:', availableRoom.objectId);
//         setFormData((prev) => ({ ...prev, roomId: availableRoom.objectId }));
//       }
//     }
//   }, [rooms, formData.roomId]);

//   useEffect(() => {
//     if (isConnected && address && !formData.paymentCoinId) {
//       setIsLoadingCoins(true);
//       setCoinsError('');
      
//       getCoins()
//         .then((coins) => {
//           if (coins.length > 0) {
//             console.log('Auto-selecting payment coin:', coins[0]);
//             setFormData((prev) => ({ ...prev, paymentCoinId: coins[0] }));
//             setCoinsError('');
//           } else {
//             setCoinsError('No payment coins available');
//           }
//         })
//         .catch((err) => {
//           console.error('Failed to fetch coins:', err);
//           setCoinsError('Failed to load payment coins');
//         })
//         .finally(() => {
//           setIsLoadingCoins(false);
//         });
//     }
//   }, [isConnected, address, getCoins, formData.paymentCoinId]);

//   // IMPROVED VALIDATION FUNCTION
//   const validateForm = () => {
//     const errors: Partial<Record<keyof typeof formData, string>> = {};
    
//     if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
//     if (!formData.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(formData.email)) errors.email = 'Valid email is required';
//     if (!formData.phone.trim()) errors.phone = 'Phone number is required';
//     if (!formData.checkInDate) errors.checkInDate = 'Check-in date is required';
//     if (!formData.checkOutDate) errors.checkOutDate = 'Check-out date is required';
//     if (formData.checkInDate && formData.checkOutDate && new Date(formData.checkInDate) >= new Date(formData.checkOutDate)) {
//       errors.checkOutDate = 'Check-out must be after check-in';
//     }
//     if (parseInt(formData.guests) < 1) errors.guests = 'At least 1 guest is required';
//     if (parseInt(formData.numRooms) < 1) errors.numRooms = 'At least 1 room is required';
//     if (!formData.roomId) errors.roomId = 'Please select a room';
    
//     // FIXED PAYMENT VALIDATION
//     if (!isConnected) {
//       errors.paymentCoinId = 'Please connect your wallet';
//     } else if (isLoadingCoins) {
//       errors.paymentCoinId = 'Loading payment options...';
//     } else if (coinsError) {
//       errors.paymentCoinId = coinsError;
//     } else if (!formData.paymentCoinId) {
//       errors.paymentCoinId = 'No payment coin selected';
//     }
    
//     setFormErrors(errors);
//     const valid = Object.keys(errors).length === 0;
//     setIsFormValid(valid);
    
//     console.log('Form validation:', {
//       valid,
//       errors,
//       isConnected,
//       isLoadingCoins,
//       coinsError,
//       hasPaymentCoinId: !!formData.paymentCoinId,
//       formData: {
//         ...formData,
//         roomId: formData.roomId ? `${formData.roomId.slice(0, 10)}...` : 'empty',
//         paymentCoinId: formData.paymentCoinId ? `${formData.paymentCoinId.slice(0, 10)}...` : 'empty'
//       }
//     });
    
//     return valid;
//   };

//   // Only validate when user tries to proceed, not on every change
//   const handleValidation = () => {
//     return validateForm();
//   };

//   const getNights = () => calculateNights(formData.checkInDate, formData.checkOutDate);

//   const getSubtotal = () => {
//     if (!rooms || !formData.roomId) return 0;
//     const room = rooms.find((r: Room) => r.objectId === formData.roomId);
//     const basePrice = room ? parseFloat(room.price_per_day) : 0;
//     return calculateSubtotal(basePrice, getNights(), parseInt(formData.numRooms));
//   };

//   const getFees = () => calculateFees(getSubtotal());

//   const getDiscount = () => calculateDiscount(getSubtotal());

//   const calculateTotalPrice = () => {
//     const subtotal = getSubtotal();
//     const fees = getFees();
//     const discount = getDiscount();
//     return calculateTotal(subtotal, fees, discount);
//   };

//   const handleInputChange = (field: keyof typeof formData, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     // Only clear error for this specific field when user starts typing
//     if (touchedFields[field] && formErrors[field]) {
//       setFormErrors((prev) => ({ ...prev, [field]: undefined }));
//     }
//   };

//   const handleInputBlur = (field: keyof typeof formData) => {
//     setTouchedFields((prev) => ({ ...prev, [field]: true }));
    
//     // Only validate this specific field on blur
//     const value = formData[field];
//     let error = '';
    
//     switch (field) {
//       case 'fullName':
//         if (!value.trim()) error = 'Full name is required';
//         break;
//       case 'email':
//         if (!value.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(value)) error = 'Valid email is required';
//         break;
//       case 'phone':
//         if (!value.trim()) error = 'Phone number is required';
//         break;
//       case 'checkInDate':
//         if (!value) error = 'Check-in date is required';
//         break;
//       case 'checkOutDate':
//         if (!value) error = 'Check-out date is required';
//         else if (formData.checkInDate && new Date(formData.checkInDate) >= new Date(value)) {
//           error = 'Check-out must be after check-in';
//         }
//         break;
//       case 'guests':
//         if (parseInt(value) < 1) error = 'At least 1 guest is required';
//         break;
//       case 'numRooms':
//         if (parseInt(value) < 1) error = 'At least 1 room is required';
//         break;
//     }
    
//     if (error) {
//       setFormErrors((prev) => ({ ...prev, [field]: error }));
//     }
//   };

//   // IMPROVED HANDLE NEXT FUNCTION
//   const handleNext = async () => {
//     // Mark all fields as touched
//     const allFields = Object.keys(formData) as (keyof typeof formData)[];
//     setTouchedFields(allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));
    
//     // If wallet is connected but coins are still loading, wait a bit
//     if (isConnected && isLoadingCoins) {
//       console.log('Waiting for coins to load...');
//       // You could show a loading state here or wait
//       setTimeout(() => {
//         if (handleValidation()) {
//           setIsReviewMode(true);
//         }
//       }, 1000);
//       return;
//     }
    
//     if (handleValidation()) {
//       setIsReviewMode(true);
//     } else {
//       console.log('Validation failed:', formErrors);
//     }
//   };

//   const handleBack = () => setIsReviewMode(false);

//   const handleConfirmBooking = async () => {
//     if (!hotel || !formData.roomId || !address || !id) return;
//     setLoading(true);
//     try {
//       const { transactionBlock, reservationId } = await bookRoom({
//         roomId: formData.roomId,
//         hotelId: id,
//         fullName: formData.fullName,
//         email: formData.email,
//         phone: formData.phone,
//         startDate: formData.checkInDate,
//         endDate: formData.checkOutDate,
//         paymentCoinId: formData.paymentCoinId,
//         guests: parseInt(formData.guests),
//         guestAddress: address,
//       });

//       const tx = Transaction.from(transactionBlock);
//       const signedTx = await signTransaction({ transaction: tx });
//       const txResult = await executeTransaction({
//         transaction: signedTx.transactionBlockBytes,
//       });

//       const event = await client.waitForTransaction({
//         digest: txResult.digest,
//         options: { showEvents: true },
//       });

//       const roomBookedEvent = event.events?.find((e) =>
//         e.type.endsWith('::room_booked::RoomBooked')
//       ) as { parsedJson?: { reservation_id: string } } | undefined;

//       if (!roomBookedEvent || !roomBookedEvent.parsedJson?.reservation_id) {
//         throw new Error('Failed to extract reservation ID from event');
//       }

//       const newBooking = {
//         id: reservationId,
//         roomId: formData.roomId,
//         hotelId: id,
//         hotelName: hotel.name,
//         guestAddress: address,
//         startDate: Math.floor(new Date(formData.checkInDate).getTime() / 1000),
//         endDate: Math.floor(new Date(formData.checkOutDate).getTime() / 1000),
//         totalCost: calculateTotalPrice(),
//         isActive: true,
//       };

//       setCurrentBooking(newBooking);
//       navigate(`/bookings/${reservationId}`);
//     } catch (error) {
//       console.error('Booking failed:', error);
//       setError('Failed to process booking');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (hotelLoading || roomsLoading) {
//     return <Loading message="Loading booking details..." />;
//   }

//   if (hotelError || roomsError || !hotel) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: 'var(--background-primary)' }}>
//         <ErrorState
//           message="Hotel or rooms not found"
//           onRetry={() => navigate('/hotels')}
//         />
//       </div>
//     );
//   }

//   // DETERMINE BUTTON STATE
//   const getButtonState = () => {
//     if (!isConnected) {
//       return { disabled: true, text: 'Connect Wallet to Continue' };
//     }
//     if (isLoadingCoins) {
//       return { disabled: true, text: 'Loading Payment Options...' };
//     }
//     if (coinsError) {
//       return { disabled: true, text: coinsError };
//     }
//     if (isReviewMode) {
//       return { 
//         disabled: storeLoading || bookRoomLoading, 
//         text: storeLoading || bookRoomLoading ? 'Confirming...' : 'Confirm and Pay' 
//       };
//     }
//     return { disabled: false, text: 'Next' };
//   };

//   const buttonState = getButtonState();

//   return (
//     <div className="min-h-screen" style={{ backgroundColor: 'var(--background-primary)' }}>
//       {/* Header */}
//       <div style={{ backgroundColor: 'var(--surface-primary)', borderColor: 'var(--border-primary)' }}>
//         <div className="p-3">
//           <div className="flex items-center justify-between h-16 px-2">
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={isReviewMode ? handleBack : () => navigate(-1)}
//                 className="p-2 rounded-full transition-colors"
//                 style={{ backgroundColor: 'var(--surface-secondary)' }}
//                 aria-label="Go back"
//               >
//                 <ArrowLeft size={20} style={{ color: 'var(--text-primary)' }} />
//               </button>
//               <h1 className="text-lg lg:text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
//                 {isReviewMode ? 'Review Your Booking' : 'Book Your Stay'}
//               </h1>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="py-8 px-4" >
//         <div className="lg:grid lg:grid-cols-3 lg:gap-8">
//           {/* Booking Form / Summary */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Hotel Info */}
//             <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: 'var(--surface-primary)', borderColor: 'var(--border-primary)' }}>
//               <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
//                 {hotel.name}
//               </h2>
//               <div className="flex items-center mb-3" style={{ color: 'var(--text-secondary)' }}>
//                 <MapPin size={16} className="mr-2 flex-shrink-0" />
//                 <span className="text-sm">{hotel.physical_address}</span>
//               </div>
//             </div>

//             {!isReviewMode ? (
//               <>
//                 {/* Available Rooms */}
//                 <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: 'var(--surface-primary)', borderColor: 'var(--border-primary)' }}>
//                   <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
//                     Available Rooms
//                   </h2>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     {rooms?.filter((room: Room) => !room.is_booked).map((room: Room) => (
//                       <Card
//                         key={room.objectId}
//                         className={`p-4 cursor-pointer transition-colors ${
//                           formData.roomId === room.objectId ? 'border-2 border-primary' : 'border-border-primary'
//                         }`}
//                         onClick={() => handleInputChange('roomId', room.objectId)}
//                       >
//                         <img
//                           src={room.imageUrl}
//                           alt={`Room ${room.objectId.slice(0, 6)}`}
//                           className="w-full h-32 object-cover rounded-md mb-2"
//                         />
//                         <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>
//                           Room {room.objectId.slice(0, 6)}...
//                         </h3>
//                         <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
//                           {room.price_per_day} SUI/night
//                         </p>
//                       </Card>
//                     ))}
//                     {rooms?.filter((room: Room) => !room.is_booked).length === 0 && (
//                       <p className="text-center col-span-full text-text-secondary">
//                         No available rooms.
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Booking Details */}
//                 <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: 'var(--surface-primary)', borderColor: 'var(--border-primary)' }}>
//                   <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
//                     Booking Details
//                   </h2>
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="fullName">
//                         Full Name
//                       </label>
//                       <Input
//                         id="fullName"
//                         placeholder="Enter full name"
//                         value={formData.fullName}
//                         onChange={(e) => handleInputChange('fullName', e.target.value)}
//                         onBlur={() => handleInputBlur('fullName')}
//                         className="w-full"
//                         error={touchedFields.fullName ? formErrors.fullName : undefined}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="email">
//                         Email
//                       </label>
//                       <Input
//                         id="email"
//                         placeholder="Enter email"
//                         value={formData.email}
//                         onChange={(e) => handleInputChange('email', e.target.value)}
//                         onBlur={() => handleInputBlur('email')}
//                         type="email"
//                         className="w-full"
//                         error={touchedFields.email ? formErrors.email : undefined}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="phone">
//                         Phone
//                       </label>
//                       <Input
//                         id="phone"
//                         placeholder="Enter phone number"
//                         value={formData.phone}
//                         onChange={(e) => handleInputChange('phone', e.target.value)}
//                         onBlur={() => handleInputBlur('phone')}
//                         type="tel"
//                         className="w-full"
//                         error={touchedFields.phone ? formErrors.phone : undefined}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="guests">
//                         Guests
//                       </label>
//                       <Input
//                         id="guests"
//                         placeholder="Number of guests"
//                         value={formData.guests}
//                         onChange={(e) => handleInputChange('guests', e.target.value)}
//                         onBlur={() => handleInputBlur('guests')}
//                         type="number"
//                         min="1"
//                         className="w-full"
//                         error={touchedFields.guests ? formErrors.guests : undefined}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="numRooms">
//                         Rooms
//                       </label>
//                       <Input
//                         id="numRooms"
//                         placeholder="Number of rooms"
//                         value={formData.numRooms}
//                         onChange={(e) => handleInputChange('numRooms', e.target.value)}
//                         onBlur={() => handleInputBlur('numRooms')}
//                         type="number"
//                         min="1"
//                         className="w-full"
//                         error={touchedFields.numRooms ? formErrors.numRooms : undefined}
//                       />
//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="checkInDate">
//                           Check-in
//                         </label>
//                         <Input
//                           id="checkInDate"
//                           placeholder="Select date"
//                           value={formData.checkInDate}
//                           onChange={(e) => handleInputChange('checkInDate', e.target.value)}
//                           onBlur={() => handleInputBlur('checkInDate')}
//                           type="date"
//                           className="w-full"
//                           min={new Date().toISOString().split('T')[0]}
//                           error={touchedFields.checkInDate ? formErrors.checkInDate : undefined}
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="checkOutDate">
//                           Check-out
//                         </label>
//                         <Input
//                           id="checkOutDate"
//                           placeholder="Select date"
//                           value={formData.checkOutDate}
//                           onChange={(e) => handleInputChange('checkOutDate', e.target.value)}
//                           onBlur={() => handleInputBlur('checkOutDate')}
//                           type="date"
//                           className="w-full"
//                           min={formData.checkInDate || new Date().toISOString().split('T')[0]}
//                           error={touchedFields.checkOutDate ? formErrors.checkOutDate : undefined}
//                         />
//                       </div>
//                     </div>

//                     {/* PAYMENT STATUS INDICATOR */}
//                     <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--surface-secondary)' }}>
//                       <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
//                         Payment Status
//                       </h3>
//                       {!isConnected ? (
//                         <p className="text-sm text-orange-500">⚠️ Please connect your wallet</p>
//                       ) : isLoadingCoins ? (
//                         <p className="text-sm text-blue-500">🔄 Loading payment options...</p>
//                       ) : coinsError ? (
//                         <p className="text-sm text-red-500">❌ {coinsError}</p>
//                       ) : formData.paymentCoinId ? (
//                         <p className="text-sm text-green-500">✅ Payment coin selected</p>
//                       ) : (
//                         <p className="text-sm text-orange-500">⚠️ No payment coin available</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: 'var(--surface-primary)', borderColor: 'var(--border-primary)' }}>
//                 <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
//                   Booking Summary
//                 </h2>
//                 <Card className="p-4 mb-4">
//                   <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
//                     Room: {formData.roomId.slice(0, 6)}...
//                   </p>
//                   <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
//                     Dates: {formData.checkInDate} - {formData.checkOutDate}
//                   </p>
//                   <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
//                     Guests: {formData.guests} | Rooms: {formData.numRooms}
//                   </p>
//                   <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
//                     Guest: {formData.fullName} ({formData.email})
//                   </p>
//                 </Card>
//                 <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
//                   Payment Details
//                 </h3>
//                 <Card className="p-4">
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Room Cost</p>
//                       <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{getSubtotal()} SUI</p>
//                     </div>
//                     <div className="flex justify-between">
//                       <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Fees</p>
//                       <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{getFees()} SUI</p>
//                     </div>
//                     <div className="flex justify-between">
//                       <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Discount</p>
//                       <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{getDiscount()} SUI</p>
//                     </div>
//                     <div className="flex justify-between mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-primary)' }}>
//                       <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Total</p>
//                       <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{calculateTotalPrice()} SUI</p>
//                     </div>
//                   </div>
//                 </Card>
//               </div>
//             )}
//             {storeError && (
//               <p className="text-red-500 text-sm mt-4 text-center">{storeError}</p>
//             )}
//           </div>

//           {/* Sticky Action Sidebar */}
//           <div className="lg:col-span-1 mt-8 lg:mt-0">
//             <div className="sticky top-24 space-y-4">
//               <div className="bg-surface-primary p-6 shadow-lg rounded-xl" style={{ backgroundColor: 'var(--surface-primary)', borderColor: 'var(--border-primary)' }} >
//                 <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
//                   Review your booking details and confirm your stay with a secure blockchain transaction.
//                 </p>
//                 <Button
//                   onClick={isReviewMode ? handleConfirmBooking : handleNext}
//                   className="w-full font-semibold py-3 rounded-lg transition-colors"
//                   disabled={buttonState.disabled}
//                 >
//                   {buttonState.text}
//                 </Button>
//                 {isReviewMode && (
//                   <Button
//                     onClick={handleBack}
//                     className="w-full mt-2 font-semibold py-3 rounded-lg transition-colors border"
//                   >
//                     Back
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookSuite;