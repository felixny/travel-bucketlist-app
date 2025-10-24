import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { destinationsApi, externalApi, imagesApi } from '../services/mockApiService';
import { Country, UnsplashImage } from '../types';
import { ArrowLeft, Upload, X, Search, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = yup.object({
  name: yup.string().required('Destination name is required'),
  country: yup.string().required('Country is required'),
  notes: yup.string().optional().default(''),
  category: yup.string().optional().default(''),
  region: yup.string().optional().default(''),
  visited: yup.boolean().default(false),
});

type FormData = yup.InferType<typeof schema>;

const AddDestination: React.FC = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [unsplashImages, setUnsplashImages] = useState<UnsplashImage[]>([]);
  const [showUnsplash, setShowUnsplash] = useState(false);
  const [unsplashQuery, setUnsplashQuery] = useState('');
  const [loadingUnsplash, setLoadingUnsplash] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      visited: false,
    },
  });

  const watchedCountry = watch('country');

  useEffect(() => {
    loadCountries();
    loadRegions();
  }, []);

  useEffect(() => {
    if (watchedCountry) {
      const country = countries.find(c => c.name === watchedCountry);
      if (country) {
        setValue('region', country.region);
      }
    }
  }, [watchedCountry, countries, setValue]);

  const loadCountries = async () => {
    try {
      const data = await externalApi.getCountries();
      setCountries(data.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      toast.error('Failed to load countries');
    }
  };

  const loadRegions = async () => {
    try {
      const data = await externalApi.getRegions();
      setRegions(data);
    } catch (error) {
      console.error('Failed to load regions:', error);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const { presignedUrl, url } = await imagesApi.getPresignedUrl(file.type, file.name);
      
      // Upload to S3
      const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (response.ok) {
        setImageUrls(prev => [...prev, url]);
        toast.success('Image uploaded successfully');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const searchUnsplash = async () => {
    if (!unsplashQuery.trim()) return;
    
    try {
      setLoadingUnsplash(true);
      const data = await externalApi.getUnsplashImages(unsplashQuery, 1, 12);
      setUnsplashImages(data.images);
    } catch (error) {
      toast.error('Failed to search images');
    } finally {
      setLoadingUnsplash(false);
    }
  };

  const addUnsplashImage = (image: UnsplashImage) => {
    setImageUrls(prev => [...prev, image.url]);
    setShowUnsplash(false);
    toast.success('Image added');
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await destinationsApi.create({
        ...data,
        visited: data.visited ?? false,
        image_urls: imageUrls,
      });
      toast.success('Destination created successfully');
      navigate('/destinations');
    } catch (error) {
      toast.error('Failed to create destination');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/destinations')}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Destinations
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Add New Destination</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination Name *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Paris, Tokyo, New York"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <select
                  {...register('country')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a country</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region
                </label>
                <select
                  {...register('region')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a region</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  {...register('category')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  <option value="Beach">Beach</option>
                  <option value="Mountain">Mountain</option>
                  <option value="City">City</option>
                  <option value="Nature">Nature</option>
                  <option value="Culture">Culture</option>
                  <option value="Adventure">Adventure</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                {...register('notes')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add any notes about this destination..."
              />
            </div>

            <div className="mt-6">
              <label className="flex items-center">
                <input
                  {...register('visited')}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">I have visited this destination</span>
              </label>
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Images</h2>
              <button
                type="button"
                onClick={() => setShowUnsplash(!showUnsplash)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Search className="h-4 w-4 mr-2" />
                Search Unsplash
              </button>
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload files</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files) {
                            Array.from(e.target.files).forEach(handleImageUpload);
                          }
                        }}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                </div>
              </div>
            </div>

            {/* Unsplash Search */}
            {showUnsplash && (
              <div className="mb-6 p-4 border border-gray-200 rounded-md">
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={unsplashQuery}
                    onChange={(e) => setUnsplashQuery(e.target.value)}
                    placeholder="Search for images..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={searchUnsplash}
                    disabled={loadingUnsplash}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loadingUnsplash ? 'Searching...' : 'Search'}
                  </button>
                </div>
                
                {unsplashImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {unsplashImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.thumb}
                          alt={image.description}
                          className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-75"
                          onClick={() => addUnsplashImage(image)}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center">
                          <Plus className="h-6 w-6 text-white opacity-0 group-hover:opacity-100" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Current Images */}
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/destinations')}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Destination'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDestination;
