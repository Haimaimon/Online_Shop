import { useState , useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { addToCart } from "../features/cartSlice";
import PayButton from './PayButton';
import axios from 'axios';
import { url , setHeaders} from '../features/api';
import { toast } from 'react-toastify';

const Home = () => {
    const { items: data, status } = useSelector((state) => state.products);
    const user = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedPriceRange, setSelectedPriceRange] = useState('All');
    const [searchTerm, setSearchTerm] = useState(''); // State for the search term
    const [sortOrder, setSortOrder] = useState('');
    const [popularityFilter, setPopularityFilter] = useState('');
    const [dateFilter , setDateFilter] = useState('newest');
    const [onSaleFilter, setOnSaleFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false); // State to toggle filter visibility
    const [outofstock , setOutOfStock] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);

    const [notifications, setNotifications] = useState([]);

    // Function to reset all filters
    const resetFilters = () => {
      setSelectedCategory('All');
      setSelectedPriceRange('All');
      setSearchTerm('');
      setSortOrder('');
      setPopularityFilter('');
      setDateFilter('newest')
      setOnSaleFilter('');
      setOutOfStock('');
  };
  useEffect(() => {
    const fetchNotifications = async () => {
        if (user && user._id) {
            try {
                const response = await axios.get(`${url}/notifications`, setHeaders());
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        }
    };

    fetchNotifications();
  }, [user]);

    const handleToggleFilters = () => {
      setShowFilters(!showFilters); // Toggle filter visibility
    };

    const handlePopularityFilterChange = (e) => {
      setPopularityFilter(e.target.value);
    };

    const handleSortOrderChange = (e) => {
      setSortOrder(e.target.value);
    };

    const handleAddToCart = async(product) => {
        const productToAdd = {
            ...product,
            price: product.isOnSale ? product.salePrice : product.price,
        };
        dispatch(addToCart(productToAdd));
        navigate("/cart");
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handlePriceRangeChange = (e) => {
        setSelectedPriceRange(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase()); // Update the search term based on user input
    };

    const handleDateFilterChange = (e) => {
      setDateFilter(e.target.value);
    };

    const handleNotifyMe = async (productId) => {
      if (!user || !user._id) {
        toast.info('Please log in to receive notifications');
          return;
      }
  
      try {
          const response = await axios.post(`${url}/notifications`, {
              productId,
              userId: user._id
          });
          toast.info('You will be notified when the product is back in stock');
      } catch (error) {
          console.error('Error sending notification request:', error);
      }
   };
  

    // Filter and sort products based on the selected criteria
    const filteredAndSortedProducts = data
      .filter(product => {
        if (selectedCategory !== 'All' && product.brand !== selectedCategory) {
          return false;
        }
        if (selectedPriceRange !== 'All') {
          const [minPrice, maxPrice] = selectedPriceRange.split('-').map(Number);
          const priceToCompare = product.isOnSale ? product.salePrice : product.price;
          return priceToCompare >= minPrice && (maxPrice ? priceToCompare <= maxPrice : true);
        }
        if (searchTerm) {
          return (
            product.name.toLowerCase().includes(searchTerm) ||
            product.desc.toLowerCase().includes(searchTerm)
          );
        }
        if (popularityFilter) {
          return popularityFilter === 'popular' ? product.popularity : !product.popularity;
        }
        if (onSaleFilter === 'onSale' && !product.isOnSale) {
          return false;
        }
        if(outofstock === 'outOfstock' && product.quantity > 0){
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const priceA = a.isOnSale ? a.salePrice : a.price;
        const priceB = b.isOnSale ? b.salePrice : b.price;

        if (sortOrder === 'priceAsc') {
          return priceA - priceB;
        } else if (sortOrder === 'priceDesc') {
          return priceB - priceA;
        }

        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);

        if (dateFilter === 'newest') {
          return dateB - dateA;
        } else if (dateFilter === 'oldest') {
          return dateA - dateB;
        }

        return 0;
      });
      
      
      
    return (
        <div className="home-container">
          <ToggleButton onClick={() => setShowNotifications(!showNotifications)}>
                {showNotifications ? 'Hide Notifications' : 'Show Notifications'}
            </ToggleButton>
            
            {showNotifications && notifications.length > 0 && (
                <div className="notification-banner">
                    {notifications.map((notification) => (
                        <div key={notification._id} className="notification-item">
                            <p>The product is back in stock!</p>
                            <Link to={`/product/${notification.productId}`} className="view-product-link">View product</Link>
                        </div>
                    ))}
                </div>
            )}
          <ShowFiltersButton onClick={handleToggleFilters}>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </ShowFiltersButton> {/* Toggle Filter Button */}
            {showFilters && ( // Only render filters if showFilters is true
            <FiltersContainer>
                <SearchInput type="text" placeholder="Search products..." onChange={handleSearchChange} value={searchTerm} />
                <FilterSelect value={selectedCategory} onChange={handleCategoryChange}>
                    <option value="All">All Categories</option>
                    {[...new Set(data.map(product => product.brand))].map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                    ))}
                </FilterSelect>
                <FilterSelect value={selectedPriceRange} onChange={handlePriceRangeChange}>
                    <option value="All">All Prices</option>
                    <option value="0-50">$0 - $50</option>
                    <option value="50-100">$50 - $100</option>
                    <option value="100-200">$100 - $200</option>
                    <option value="200-0">$200 - $500</option>
                    <option value="500-1000">$500 - $1000</option>
                    <option value="1000-0">$1000+</option>

                </FilterSelect>

                <FilterSelect value={sortOrder} onChange={handleSortOrderChange}>
                  <option value="">Sort by</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                </FilterSelect>

                <FilterSelect value={popularityFilter} onChange={handlePopularityFilterChange}>
                  <option value="">Popularity</option>
                  <option value="popular">Popular</option>
                  <option value="notPopular">Not Popular</option>
              </FilterSelect>
              <FilterSelect value={dateFilter} onChange={handleDateFilterChange}>
                  <option value="">Sort by Date</option>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
              </FilterSelect>        
              <FilterSelect value={onSaleFilter} onChange={(e) => setOnSaleFilter(e.target.value)}>
                  <option value="">Sort by On Sale</option>
                  <option value="">All Products</option>
                  <option value="onSale">On Sale</option>
              </FilterSelect>
              <FilterSelect value={outofstock} onChange={(e) => setOutOfStock(e.target.value)}>
                  <option value="">Sort by Out Of Stock</option>
                  <option value="">All Products</option>
                  <option value="outOfstock">Out Of Stock</option>
              </FilterSelect>      
              <ResetFilterBtn onClick={resetFilters}>
                  Reset Filters
              </ResetFilterBtn>    
            </FiltersContainer>
            )}
            {status === "success" ? (
                <>
                    <h2>Online - Shop </h2>
                    <div className="products">
                    {filteredAndSortedProducts.map((product) => (
                            <div key={product._id} className="product">
                                <h2>{product.brand}</h2>
                                <h4>{product.name}</h4>
                                <Link to={`/product/${product._id}`}>
                                <img src={product.image.url} alt={product.name} />
                                </Link>
                                <ProductDetails>
                                <span className="desc">Quantity :{product.quantity}</span>
                                <span className="desc">Description :{product.desc}</span>
                                  <span className="upload-date">Uploaded: {new Date(product.createdAt).toLocaleDateString()}</span>
                                    {product.isOnSale ? (
                                        <>
                                            <SalePrice>SalePrice ${product.salePrice}</SalePrice>
                                            <OriginalPrice isOnSale={true}>Price ${product.price}</OriginalPrice>
                                        </>
                                    ) : (
                                        <span>${product.price}</span>
                                    )}
                                                                  </ProductDetails>
                                      {product.quantity > 0 ? (
                                        <>
                                          <button onClick={() => handleAddToCart(product)}>
                                            Add To Cart
                                          </button>
                                          <PayButton cartItems={[product]} />
                                        </>
                                      ) : (
                                        //<OutOfStock>Out of Stock</OutOfStock>
                                        <button onClick={() => handleNotifyMe(product._id)}>
                                            Notify Me
                                        </button>
                                      )}
                                    </div>
                        ))}
                    </div>
                </>
            ) : status === "pending" ? (
                <p>Loading...</p>
            ) : (
                <p>Unexpected error occurred...</p>
            )}
        </div>
    );
};

export default Home;

// Styled components for the filter section
const FiltersContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const FilterSelect = styled.select`
  padding: 5px;
  border-radius: 2px;
  background-color: #f0f0f0;
  border: 0.2px solid #ccc;
  &:hover {
    border-color: #888;
  }
`;
const ResetFilterBtn = styled.button`
  padding: 5px;
  border-radius: 2px;
  background-color: #fd0000;
  border: 0.2px solid #fa0101;
  &:hover {
    border-color: #e40000f5;
  }
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column; /* Aligns items vertically */
  gap: 5px; /* Adds space between each item */

  span {
    font-weight: bold; /* Makes text bold */
    font-size: 1.1rem; /* Adjusts the size to make it beautiful */
    line-height: 1.4; /* Improves readability */
  }

  .desc {
    color: #666; /* Optional: Adds a subtle color to the description */
  }

  .price {
    color: #333; /* Optional: Darker color for emphasis */
  }

  .upload-date {
    font-style: italic; /* Optional: Differentiates the upload date */
    color: #999; /* Optional: Subtle color for the upload date */
  }
`;

const OutOfStock = styled.div`
    color: red;
    font-weight: bold;
    // Add more styles as needed
`;

const SearchInput = styled.input`
  width: 30%;
  padding: 10px 15px;
  margin: 20px 0;
  border-radius: 25px;
  border: 1px solid #ccc;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
  }

  &::placeholder {
    color: #999;
  }
`;

const SalePrice = styled.span`
    color: red;
    font-weight: bold;
`;

const OriginalPrice = styled.span`
    text-decoration: ${({ isOnSale }) => isOnSale ? 'line-through' : 'none'};
    color: ${({ isOnSale }) => isOnSale ? '#999' : '#333'};
`;

const ShowFiltersButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:focus {
    outline: none;
  }
`;
// Styled components
const ToggleButton = styled.button`
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
    font-size: 16px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #45a049;
    }
`;
