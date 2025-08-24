"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Check, X } from "lucide-react";

interface ImageSelectorProps {
  currentImageUrl?: string;
  requestType: string;
  context: string;
  onImageChange: (newImageUrl: string) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  currentImageUrl,
  requestType,
  context,
  onImageChange,
}) => {
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  const [availableImages, setAvailableImages] = useState<any[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");

  const handleFetchImages = async () => {
    if (!requestType || !context) return;
    
    setIsLoadingImages(true);
    try {
      const response = await fetch("/api/images/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          request_type: requestType,
          context: context,
          count: 10
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Filter out the currently selected image from the options
        const filteredImages = (data.images || []).filter((image: any) => 
          image.urls.regular !== currentImageUrl
        );
        setAvailableImages(filteredImages);
        setIsImageSelectorOpen(true);
      } else {
        console.error("Failed to fetch images");
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleSelectImage = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
  };

  const handleConfirmImageSelection = () => {
    if (selectedImageUrl) {
      onImageChange(selectedImageUrl);
      setIsImageSelectorOpen(false);
      setSelectedImageUrl("");
    }
  };

  const handleCancelImageSelection = () => {
    setIsImageSelectorOpen(false);
    setSelectedImageUrl("");
    setAvailableImages([]);
  };

  return (
    <>
      {/* Current Image with Change Button */}
      {currentImageUrl && (
        <div className="mb-6 animate-fade-in" style={{ animationDelay: '150ms', animationFillMode: 'backwards' }}>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">
            Cover Image
          </label>
          <div className="relative rounded-lg overflow-hidden shadow-md max-w-md">
            <img
              src={currentImageUrl}
              alt="Cover image"
              className="w-full h-48 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <div className="absolute top-2 right-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleFetchImages}
                disabled={isLoadingImages}
                className="text-xs bg-white/90 hover:bg-white shadow-sm"
              >
                {isLoadingImages ? (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Change
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Image Selector Modal */}
      {isImageSelectorOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Choose a Cover Image
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelImageSelection}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {availableImages.map((image, index) => (
                  <div
                    key={image.id || index}
                    className={`relative rounded-lg overflow-hidden shadow-md cursor-pointer transition-all duration-200 ${
                      selectedImageUrl === image.urls.regular
                        ? 'ring-4 ring-primary scale-105'
                        : 'hover:scale-102'
                    }`}
                    onClick={() => handleSelectImage(image.urls.regular)}
                  >
                    <img
                      src={image.urls.small}
                      alt={image.description}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    {selectedImageUrl === image.urls.regular && (
                      <div className="absolute top-2 right-2">
                        <div className="bg-primary rounded-full p-1.5 shadow-lg">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={handleCancelImageSelection}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmImageSelection}
                  disabled={!selectedImageUrl}
                >
                  Update Image
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageSelector;