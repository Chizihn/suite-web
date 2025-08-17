import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateHotel } from '../hooks/useMutations';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import Input from '../components/ui/Input';

export const CreateHotel = () => {
  const [name, setName] = useState('');
  const [physicalAddress, setPhysicalAddress] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate: createHotel, isPending: isCreating } = useCreateHotel();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!name || !physicalAddress || !image) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    
    createHotel({
      name,
      physicalAddress,
      image
    }, {
      onSuccess: () => {
        setIsSuccess(true);
        // Reset form
        setName('');
        setPhysicalAddress('');
        setImage(null);
        
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      },
      onError: (err) => {
        console.error('Error creating hotel:', err);
        setError('Failed to create hotel. Please try again.');
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background-primary)' }}>
        <Card className="max-w-md w-full p-8 text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Success!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Hotel created successfully.</p>
          <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>Redirecting to home page...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--background-primary)' }}>
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Create New Hotel
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Fill in the details to add a new hotel listing
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 rounded-md" style={{ backgroundColor: 'var(--surface-error)', border: '1px solid var(--border-error)' }}>
              <p className="text-sm" style={{ color: 'var(--text-error)' }}>{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <Input
              label="Hotel Name"
              id="name"
              type="text"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="Enter hotel name"
            />
            
            <Input
              label="Physical Address"
              id="address"
              type="text"
              value={physicalAddress}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPhysicalAddress(e.target.value)}
              placeholder="Enter physical address"
            />
            
            <div>
              <label 
                htmlFor="image" 
                className="block text-sm font-medium mb-1" 
                style={{ color: 'var(--text-primary)' }}
              >
                Hotel Image
              </label>
              <div className="mt-1">
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm"
                  style={{
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--surface-primary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '0.375rem',
                    padding: '0.5rem 0.75rem',
                  }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImage(e.target.files[0]);
                    }
                  }}
                />
                {image && (
                  <p className="mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    Selected: {image.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button 
              onClick={() => {
                const form = document.querySelector('form');
                if (form) {
                  const formEvent = { preventDefault: () => {} } as FormEvent<HTMLFormElement>;
                  handleSubmit(formEvent);
                }
              }}
              disabled={isCreating || !name || !physicalAddress || !image}
              fullWidth
              loading={isCreating}
            >
              {isCreating ? 'Creating...' : 'Create Hotel'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateHotel;
