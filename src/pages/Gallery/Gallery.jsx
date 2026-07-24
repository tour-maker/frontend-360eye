import React, { useState, useEffect } from "react";
import { FiSearch, FiX, FiMapPin, FiHome, FiFilter, FiMenu, FiLayers, FiRefreshCw, FiArrowRight, FiCheckCircle, FiSliders } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";
import {
  fetchProducts,
  fetchPropertyStatus,
  fetchPropertyType,
  fetchAreas,
} from "../../services/galleryService";
import { useSearchParams } from "react-router-dom";

export const Gallery = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDropdown, setSelectedDropdown] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [typeResponse, setTypeResponse] = useState(null);
  
  const [propertyStatuses, setPropertyStatuses] = useState([]);
  const [propertyStatusOptions, setPropertyStatusOptions] = useState([]);

  const [propertyTypeOptions, setPropertyTypeOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);

  const [filteredTypeOptions, setFilteredTypeOptions] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedBHKs, setSelectedBHKs] = useState([]);
  const [voiceOverOnly, setVoiceOverOnly] = useState(false);
  const [selectedViewModes, setSelectedViewModes] = useState([]);
  const [selectedPlotStatuses, setSelectedPlotStatuses] = useState([]);

  const [selectedPropertyStatuses, setSelectedPropertyStatuses] = useState(
    searchParams.get('status') ? searchParams.get('status').split(',') : []
  );
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState(
    searchParams.get('type') ? searchParams.get('type').split(',') : []
  );
  const [selectedAreas, setSelectedAreas] = useState(
    searchParams.get('area') ? searchParams.get('area').split(',') : []
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ""
  );

  // Helper to extract gallery-relative path from a full or relative tourURL
  // Returns everything after the first 'gallery/' segment.
  const getGalleryRelativePath = (url) => {
    if (!url || typeof url !== 'string') return null;
    const extract = (pathname) => {
      const parts = pathname.split('/').filter(Boolean);
      const gIdx = parts.indexOf('gallery');
      if (gIdx !== -1 && parts[gIdx + 1]) {
        return parts.slice(gIdx + 1).join('/'); // e.g., '3d/slug/index.html'
      }
      // If pathname already starts with gallery, return the rest
      if (parts[0] === 'gallery' && parts.length > 1) {
        return parts.slice(1).join('/');
      }
      return null;
    };
    try {
      const u = new URL(url);
      return extract(u.pathname);
    } catch {
      // Not an absolute URL; treat as relative path
      return extract(url);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch products with a higher limit (300 instead of default 10)
        const [productsResponse, statusResponse, typeResponseData, areasResponse] = 
          await Promise.all([
            fetchProducts("Virtual Tour", 1, 400), // Set page to 1, limit to 300
            fetchPropertyStatus(),
            fetchPropertyType(),
            fetchAreas()
          ]);
          
        // Store the type response data in state
        setTypeResponse(typeResponseData);
  
        if (productsResponse.success) {
          const virtualTourProducts = productsResponse.products.filter(
            (product) => product.categoryType === "Virtual Tour"
          );
  
          // Create maps for quick lookup
          const statusesMap = statusResponse.propertyStatuses.reduce((map, status) => {
            if (status.status) map[status._id] = status.propertyStatusName;
            return map;
          }, {});
          const typesMap = typeResponseData.propertyTypes.reduce((map, type) => {
            if (type.status) map[type._id] = type.propertyName;
            return map;
          }, {});
          const propertyTypesMap = typeResponseData.propertyTypes.reduce((map, type) => {
            if (type.status) map[type._id] = type.propertyPhoto;
            return map;
          }, {});

          const formattedData = virtualTourProducts.map((product) => {
            const galleryPath = getGalleryRelativePath(product.tourURL);
            const tourWebUrl = galleryPath ? `/gallery/${galleryPath}` : product.tourURL;
            return {
              image: `${import.meta.env.VITE_BACKEND_URL}${product.thumbImage}`,
              title: product.tourName,
              tourURL: product.tourURL,
              tourWebUrl,
              propertyStatus: statusesMap[product.propertyStatus] || '',
              propertyType: typesMap[product.propertyType] || '',
              propertyTypePhoto: propertyTypesMap[product.propertyType] || '',
              area: product.area || "",
              bhkType: Array.isArray(product.bhkType)
                ? product.bhkType
                : (product.bhkType ? [product.bhkType] : []),
              plotStatus: product.plotStatus || "",
              hasVoiceOver: !!product.hasVoiceOver,
              viewMode: product.viewMode || "Day",
            };
          });
          
          setData(formattedData);
          setFilteredData(formattedData);
  
          const activeStatuses = statusResponse?.propertyStatuses?.filter((status) => status.status === true) || [];
          setPropertyStatuses(activeStatuses);
          setPropertyStatusOptions(activeStatuses.map(status => status.propertyStatusName));

          const activeTypes = typeResponseData?.propertyTypes
            ?.filter((type) => type.status === true) || [];
          setPropertyTypeOptions(activeTypes.map((t) => t.propertyName));
  
          const uniqueAreas = [...new Set(formattedData
            .map(item => item.area)
            .filter(area => area && area.trim() !== '')
          )];
          setAreaOptions(uniqueAreas);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setPropertyStatusOptions([]);
        setPropertyTypeOptions([]);
        setAreaOptions([]);
      }
    };
    fetchAllData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 640 && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSearchOpen]);

  // Apply filters when data is loaded and there are URL parameters
  useEffect(() => {
    if (data.length > 0) {
      filterData(searchQuery, selectedPropertyStatuses, selectedPropertyTypes, selectedAreas);
    }
  }, [data, searchQuery, selectedPropertyStatuses, selectedPropertyTypes, selectedAreas, selectedBHKs, voiceOverOnly, selectedViewModes, selectedPlotStatuses]);

  const isMobile = windowWidth < 640;

  const filterData = (query, statuses, types, areas) => {
    let filtered = [...data];

    if (query) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (statuses.length > 0) {
      filtered = filtered.filter((item) => 
        statuses.includes(item.propertyStatus)
      );
    }

    if (types.length > 0) {
      filtered = filtered.filter((item) => 
        types.includes(item.propertyType)
      );
    }

    if (areas.length > 0) {
      filtered = filtered.filter((item) => 
        areas.includes(item.area)
      );
    }

    if (selectedBHKs.length > 0) {
      filtered = filtered.filter((item) => Array.isArray(item.bhkType) && item.bhkType.some((t) => selectedBHKs.includes(t)));
    }

    if (voiceOverOnly) {
      filtered = filtered.filter((item) => item.hasVoiceOver === true);
    }

    if (selectedViewModes.length > 0) {
      filtered = filtered.filter(
        (item) => selectedViewModes.includes(item.viewMode) || item.viewMode === "Both"
      );
    }
    if (selectedPlotStatuses.length > 0) {
      filtered = filtered.filter((item) => selectedPlotStatuses.includes(item.plotStatus));
    }

    setFilteredData(filtered);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterData(query, selectedPropertyStatuses, selectedPropertyTypes, selectedAreas);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedPropertyStatuses([]);
    setSelectedPropertyTypes([]);
    setSelectedAreas([]);
    setSelectedBHKs([]);
    setVoiceOverOnly(false);
    setSelectedViewModes([]);
    setSelectedPlotStatuses([]);
    setFilteredData([...data]);
  };

  const handleDropdownClick = (dropdown) => {
    setSelectedDropdown(dropdown);
    setIsModalOpen(true);
  };

  const handleOptionSelect = (option) => {
    let newSelectedOptions = [option];
    
    switch (selectedDropdown) {
      case "Property Status":
        setSelectedPropertyStatuses(newSelectedOptions);
        const typesForStatus = data
          .filter(item => item.propertyStatus === option)
          .map(item => item.propertyType)
          .filter((value, index, self) => value && self.indexOf(value) === index);
        setFilteredTypeOptions(typesForStatus);
        break;
        
      case "Property Type":
        setSelectedPropertyTypes(newSelectedOptions);
        break;
        
      case "Area":
        setSelectedAreas(newSelectedOptions);
        break;
        
      default:
        return;
    }

    filterData(
      searchQuery,
      selectedDropdown === "Property Status" ? newSelectedOptions : selectedPropertyStatuses,
      selectedDropdown === "Property Type" ? newSelectedOptions : selectedPropertyTypes,
      selectedDropdown === "Area" ? newSelectedOptions : selectedAreas
    );

    setIsModalOpen(false);
  };

  const removeFilter = (filterType, value) => {
    switch (filterType) {
      case 'Property Status':
        const newStatuses = selectedPropertyStatuses.filter(status => status !== value);
        setSelectedPropertyStatuses(newStatuses);
        filterData(searchQuery, newStatuses, selectedPropertyTypes, selectedAreas);
        break;
      case 'Property Type':
        const newTypes = selectedPropertyTypes.filter(type => type !== value);
        setSelectedPropertyTypes(newTypes);
        filterData(searchQuery, selectedPropertyStatuses, newTypes, selectedAreas);
        break;
      case 'Area':
        const newAreas = selectedAreas.filter(area => area !== value);
        setSelectedAreas(newAreas);
        filterData(searchQuery, selectedPropertyStatuses, selectedPropertyTypes, newAreas);
        break;
    }
  };

  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('search', searchQuery);
    if (selectedPropertyStatuses.length > 0) params.set('status', selectedPropertyStatuses.join(','));
    if (selectedPropertyTypes.length > 0) params.set('type', selectedPropertyTypes.join(','));
    if (selectedAreas.length > 0) params.set('area', selectedAreas.join(','));
    
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedPropertyStatuses, selectedPropertyTypes, selectedAreas, setSearchParams]);

  const renderSelectedFilters = () => {
    const allFilters = [
      ...selectedPropertyStatuses.map(status => {
        const statusObj = propertyStatuses.find(s => s.propertyStatusName === status);
        return { 
          type: 'Property Status', 
          value: status,
          image: statusObj?.propertyStatusPhoto
        };
      }),
      ...selectedPropertyTypes.map(type => {
        const typeObj = propertyTypeOptions.find(t => t === type);
        return { 
          type: 'Property Type', 
          value: type,
          image: typeObj?.propertyPhoto 
        };
      }),
      ...selectedAreas.map(area => ({ 
        type: 'Area', 
        value: area,
        icon: <FiMapPin className="text-gray-400 mr-1" size={14} />
      }))
    ];
  
    if (allFilters.length === 0 && !searchQuery) return null;
  
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-2 mb-4">
        {allFilters.map((filter, index) => (
          <div
            key={index}
            className="flex items-center bg-[#86BA3A]/20 text-[#86BA3A] px-3 py-1 rounded-full text-sm"
          >
            {filter.image ? (
              <img 
                src={`${import.meta.env.VITE_BACKEND_URL}${filter.image}`}
                alt={filter.value}
                className="w-4 h-4 mr-1 object-cover rounded"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.marginLeft = '0';
                }}
              />
            ) : (
              filter.icon
            )}
            <span>{filter.value}</span>
            <button
              onClick={() => removeFilter(filter.type, filter.value)}
              className="ml-2 hover:text-white"
            >
              <FiX size={14} />
            </button>
          </div>
        ))}
        <button
          onClick={handleReset}
          className="text-[#86BA3A] text-sm hover:underline flex items-center"
        >
          Clear all
        </button>
      </div>
    );
  };

  const FilterButton = ({ icon, label, onClick, active, mobile = false }) => (
    <button
      onClick={onClick}
      className={`flex items-center rounded-xl border transition-all ${
        active
          ? "border-[#86BA3A] text-[#86BA3A] bg-[#86BA3A]/10"
          : "border-gray-600 text-gray-300 hover:text-white hover:border-white"
      } ${
        mobile 
          ? "px-2 py-1 text-xs flex-shrink-0" 
          : "px-3 py-2 text-sm gap-2"
      }`}
      aria-label={label}
    >
      <span className="text-base">{icon}</span>
      {label}
      {!mobile && (
        <IoMdArrowDropdown className={`transition-transform ${active ? 'rotate-180' : ''}`} />
      )}
    </button>
  );

  const GalleryCard = ({ item }) => {
    const galleryPath = getGalleryRelativePath(item.tourURL);
    // Use frontend URL for sharing - crawler middleware will handle social media bots
    const shareUrl = galleryPath 
      ? `${window.location.origin}/gallery/${galleryPath}` 
      : item.tourURL;
    
    const handleShare = async (e) => {
      e.stopPropagation();
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: item.title,
            text: `Check out this 360° virtual tour: ${item.title}`,
            url: shareUrl
          });
        } catch (err) {
          if (err.name !== 'AbortError') {
            copyToClipboard(shareUrl);
          }
        }
      } else {
        copyToClipboard(shareUrl);
      }
    };
    
    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text).then(() => {
        alert('Link copied to clipboard!');
      });
    };
    
    return (
      <div
        className="group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] cursor-pointer"
        onClick={() => window.open(item.tourWebUrl || item.tourURL, "_blank")}
      >
        <div className="aspect-w-16 aspect-h-9 bg-gray-800 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between">
          <div className="flex-1 flex justify-end p-2">
            <button
              onClick={handleShare}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-full transition-colors"
              title="Share tour"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
          <div className="w-full px-1.5 py-1 bg-[#1a1a1a]/90 backdrop-blur-sm">
            {/* Title always visible here */}
            <h3 className="text-white text-sm font-medium truncate mb-1">{item.title}</h3>
            
            {/* Filters below title */}
            <div className="flex flex-wrap gap-2 justify-start items-center">
              {item.propertyStatus && (
                <div className="inline-flex items-center gap-0.5">
                  <FiCheckCircle className="text-[#86BA3A]" size={14} />
                  <span className="text-xs bg-[#86BA3A]/20 text-[#86BA3A] px-2 py-0.5 rounded inline-block">
                    {item.propertyStatus}
                  </span>
                </div>
              )}
              {item.propertyType && (
                <div className="inline-flex items-center gap-0.5">
                  {item.propertyTypePhoto ? (
                    <img 
                      src={`${import.meta.env.VITE_BACKEND_URL}${item.propertyTypePhoto}`}
                      alt={item.propertyType}
                      className="w-4 h-4 object-cover rounded-full"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <FiLayers className="text-[#86BA3A]/90" size={14} />
                  )}
                  <span className="text-xs bg-white/10 text-white px-2 py-0.5 rounded inline-block">
                    {item.propertyType}
                  </span>
                </div>
              )}
              {item.area && (
                <div className="inline-flex items-center gap-0.5">
                  <FiMapPin className="text-[#86BA3A]/90" size={14} />
                  <span className="text-xs bg-white/10 text-white px-2 py-0.5 rounded inline-block">
                    {item.area}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Base title visible when not hovering */}
        <div className="bg-[#1a1a1a] p-1 group-hover:opacity-0 transition-opacity">
          <h3 className="text-white text-sm font-medium truncate">{item.title}</h3>
        </div>
      </div>
    );
  };

  const FilterModal = ({ title, options, onSelect, onClose }) => {
    const getOptions = () => {
      // Return property statuses
      if (title === "Property Status") {
        return propertyStatuses.map(status => ({
          name: status.propertyStatusName,
          photo: status.propertyStatusPhoto
        }));
      }                         
      
      // For property types, filter based on selected property statuses
      if (title === "Property Type") {
        // Get all types or filter based on selected statuses
        let relevantTypes = [];
        
        if (selectedPropertyStatuses.length > 0) {
          // Filter products that match the selected statuses
          const filteredByStatus = data.filter(item => 
            selectedPropertyStatuses.includes(item.propertyStatus)
          );
          
          // Get unique property types from filtered products
          relevantTypes = [...new Set(filteredByStatus.map(item => item.propertyType).filter(Boolean))];
          
          // Make sure both arrays exist before filtering
          if (typeResponse?.propertyTypes) {
            return typeResponse.propertyTypes
              .filter(type => 
                type.status === true && 
                relevantTypes.includes(type.propertyName)
              )
              .map(type => ({
                name: type.propertyName,
                photo: type.propertyPhoto
              }));
          }
          
          // Fallback to simpler filtering if no typeResponse
          return propertyTypeOptions
            .filter(type => relevantTypes.includes(type))
            .map(type => ({
              name: type,
              photo: null,
              icon: <FiLayers className="text-[#86BA3A]/90" size={14} />
            }));
        } else {
          // If no statuses selected, show all types
          if (propertyTypeOptions.length > 0 && typeResponse?.propertyTypes) {
            return typeResponse.propertyTypes
              .filter(type => type.status === true && propertyTypeOptions.includes(type.propertyName))
              .map(type => ({
                name: type.propertyName,
                photo: type.propertyPhoto
              }));
          }
          
          // Fallback to simple list with icons if we don't have the response data
          return propertyTypeOptions.map(type => ({
            name: type,
            photo: null,
            icon: <FiLayers className="text-[#86BA3A]/90" size={14} />
          }));
        }
      }
      
      // For areas, filter based on both selected property statuses and types
      let filteredProducts = [...data];
      
      // Apply status filter if selected
      if (selectedPropertyStatuses.length > 0) {
        filteredProducts = filteredProducts.filter(item => 
          selectedPropertyStatuses.includes(item.propertyStatus)
        );
      }
      
      // Apply type filter if selected
      if (selectedPropertyTypes.length > 0) {
        filteredProducts = filteredProducts.filter(item => 
          selectedPropertyTypes.includes(item.propertyType)
        );
      }
      
      // Get unique areas from filtered products
      let relevantAreas = [];
      
      if (selectedPropertyStatuses.length > 0 || selectedPropertyTypes.length > 0) {
        relevantAreas = [...new Set(filteredProducts.map(item => item.area).filter(Boolean))];
      } else {
        relevantAreas = [...areaOptions];
      }
      
      return relevantAreas.map(area => ({
        name: area,
        photo: null,
        icon: <FiMapPin className="text-gray-400" size={18} />
      }));
    };
  
    // Always use getOptions() to ensure filtering logic is applied consistently
    const displayOptions = getOptions();

    if (title === "Tag") {
      const bhkOptions = ["2 BHK", "3 BHK", "3.5 BHK", "4 BHK", "5 BHK"];
      const plotStatusOptions = ["Available", "Reserved", "Sold"];

      const pillClass = (active) =>
        `rounded-xl border px-4 py-2 text-sm ${active ? "border-[#86BA3A] text-[#86BA3A]" : "border-gray-600 text-gray-300"}`;

      const toggleArrayValue = (setter, currentArray, value) => {
        setter(
          currentArray.includes(value)
            ? currentArray.filter((v) => v !== value)
            : [...currentArray, value]
        );
      };

      return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
          <div className="bg-gray-900 rounded-xl max-w-md w-full border border-gray-700 shadow-2xl flex flex-col" style={{ maxHeight: '80vh' }}>
            <div className="bg-gray-900 p-4 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-medium">Tag</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <FiX size={24} />
              </button>
            </div>
            <div className="overflow-y-auto p-4" style={{ maxHeight: '60vh' }}>
              <div className="flex flex-wrap gap-2">
                {bhkOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => toggleArrayValue(setSelectedBHKs, selectedBHKs, option)}
                    className={pillClass(selectedBHKs.includes(option))}
                  >
                    {option}
                  </button>
                ))}
                <button
                  onClick={() => toggleArrayValue(setSelectedViewModes, selectedViewModes, "Day")}
                  className={pillClass(selectedViewModes.includes("Day"))}
                >
                  Day
                </button>
                <button
                  onClick={() => toggleArrayValue(setSelectedViewModes, selectedViewModes, "Night")}
                  className={pillClass(selectedViewModes.includes("Night"))}
                >
                  Night
                </button>
                <button
                  onClick={() => setVoiceOverOnly((v) => !v)}
                  className={pillClass(voiceOverOnly)}
                >
                  Voice Over
                </button>
                {plotStatusOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => toggleArrayValue(setSelectedPlotStatuses, selectedPlotStatuses, option)}
                    className={pillClass(selectedPlotStatuses.includes(option))}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

  
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gray-900 rounded-xl max-w-md w-full border border-gray-700 shadow-2xl flex flex-col" style={{ maxHeight: '80vh' }}>
          <div className="bg-gray-900 p-4 border-b border-gray-800 flex justify-between items-center">
            <h3 className="text-xl font-medium">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <FiX size={24} />
            </button>
          </div>
          
          <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
            {displayOptions.length > 0 ? (
              <div className="p-4 space-y-2">
                {displayOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => onSelect(option.name)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-3"
                  >
                    {option.photo ? (
                      <img 
                        src={`${import.meta.env.VITE_BACKEND_URL}${option.photo}`}
                        alt={option.name}
                        className="w-7 h-7 object-cover rounded-full"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          // Show fallback icon if image fails to load
                          e.target.parentElement.innerHTML = '<span class="flex-shrink-0">' + 
                            (title === 'Property Type' ? '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="7" y="7" width="3" height="9"></rect><rect x="14" y="7" width="3" height="5"></rect></svg>' : '') + 
                            '</span>';
                        }}
                      />
                    ) : option.icon ? (
                      <span className="flex-shrink-0">{option.icon}</span>
                    ) : (
                      <div className="w-6 h-6 flex items-center justify-center">
                        {title === "Property Status" && <FiHome className="text-gray-400" />}
                        {title === "Area" && <FiMapPin className="text-gray-400" />}
                      </div>
                    )}
                    <span>{option.name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">
                {title === "Property Type" && selectedPropertyStatuses.length > 0
                  ? "No types available for selected status"
                  : "No options available"}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-screen bg-black text-white py-4 px-4 sm:px-8 lg:px-[5vw] xl:px-[10vw] flex flex-col">
      {/* Search and Filter Controls */}
      <div className="mb-4">
        {isMobile ? (
          <div className="mb-4">
            <div className="flex flex-col gap-2">
              {isSearchOpen ? (
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-600 bg-gray-900 text-white focus:outline-none"
                    autoFocus
                  />
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 w-full">
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 text-gray-400 hover:text-white flex-shrink-0"
                  >
                    <FiSearch size={20} />
                  </button>
                  <div className="flex overflow-x-auto gap-2 scrollbar-hide">
                    <FilterButton 
                      icon={<FiLayers size={18} />}
                      label="Type"
                      onClick={() => handleDropdownClick("Property Type")}
                      active={selectedPropertyTypes.length > 0}
                      mobile
                    />
                    <FilterButton 
                      icon={<FiHome size={18} />}
                      label="Status"
                      onClick={() => handleDropdownClick("Property Status")}
                      active={selectedPropertyStatuses.length > 0}
                      mobile
                    />
                    <FilterButton 
                      icon={<FiMapPin size={18} />}
                      label="Area"
                      onClick={() => handleDropdownClick("Area")}
                      active={selectedAreas.length > 0}
                      mobile
                    />
                                        <FilterButton
                      icon={<FiSliders size={18} />}
                      label="Tag"
                      onClick={() => handleDropdownClick("Tag")}
                      active={selectedBHKs.length > 0 || voiceOverOnly || selectedViewModes.length > 0 || selectedPlotStatuses.length > 0}
                      mobile
                    />
                    <button
                      onClick={handleReset}
                      className={`p-2 rounded-full border flex-shrink-0 ${
                        selectedPropertyStatuses.length > 0 || 
                        selectedPropertyTypes.length > 0 || 
                        selectedAreas.length > 0
                          ? "border-[#86BA3A] text-[#86BA3A] bg-[#86BA3A]/10"
                          : "border-gray-600 text-gray-300 hover:text-white hover:border-white"
                      }`}
                    >
                      <FiRefreshCw size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-4">
              <div className="relative w-full sm:w-96">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-600 bg-gray-900 text-white focus:outline-none focus:ring-1 focus:ring-[#86BA3A] focus:border-[#86BA3A] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <FiX size={18} />
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <FilterButton 
                  icon={<FiLayers size={16} />}
                  label="Type"
                  onClick={() => handleDropdownClick("Property Type")}
                  active={selectedPropertyTypes.length > 0}
                />
                <FilterButton 
                  icon={<FiHome size={16} />}
                  label="Status"
                  onClick={() => handleDropdownClick("Property Status")}
                  active={selectedPropertyStatuses.length > 0}
                />
                <FilterButton 
                  icon={<FiMapPin size={16} />}
                  label="Area"
                  onClick={() => handleDropdownClick("Area")}
                  active={selectedAreas.length > 0}
                />
                                <FilterButton
                  icon={<FiSliders size={16} />}
                  label="Tag"
                  onClick={() => handleDropdownClick("Tag")}
                  active={selectedBHKs.length > 0 || voiceOverOnly || selectedViewModes.length > 0 || selectedPlotStatuses.length > 0}
                />
              </div>
            </div>
          </div>
        )}

        {/* Selected Filters Display */}
        {renderSelectedFilters()}
      </div>

      {/* Gallery Content with Scrollable Container */}
      <div className="flex-1 overflow-hidden">
        {filteredData.length > 0 ? (
          <div className="h-full overflow-y-auto pb-8" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredData.map((item, index) => (
                <GalleryCard key={index} item={item} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl text-gray-400">No properties found matching your criteria</h3>
            <button
              onClick={handleReset}
              className="mt-4 text-[#86BA3A] hover:underline flex items-center justify-center mx-auto"
            >
              Reset filters <FiArrowRight className="ml-1" />
            </button>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {isModalOpen && (
        <FilterModal
          title={selectedDropdown}
          options={
            selectedDropdown === "Property Status" ? 
              propertyStatusOptions : // array of strings
            selectedDropdown === "Property Type" ? 
              propertyTypeOptions : // array of strings
            areaOptions // array of strings
          }
          onSelect={handleOptionSelect}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};