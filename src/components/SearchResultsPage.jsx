import { useDispatch, useSelector } from "react-redux";
import { selectSearch } from "../redux/selectors/selectors";
import { addToCart } from "../redux/features/cartSlice";
import { useEffect, useState } from "react";

export const SearchResultsPage = () => {
  const { searchResults } = useSelector(selectSearch);
  const [isQtyModifierOpen, setIsQtyModifierOpen] = useState(false);
  const [productQty, setProductQty] = useState(1);
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState({});
  const dispatch = useDispatch();
  const buyButtonHandler = (productToBuy) => {
    dispatch(addToCart(productToBuy));
  };
  useEffect(() => {
    console.log("SearchResultsPage", searchResults);
  }, []);
  const paginationHandler = (current, pageSize) => {
    setPage(current);
    window.scrollTo(0, 0);
  };

  const productQtyHandler = (product) => {
    setIsQtyModifierOpen(true);
  };
  const modifierHandler = (el) => {
    dispatch(addToCart({ ...selectedProduct, inCartQuantity: productQty }));
    setIsQtyModifierOpen(false);
    setSelectedProduct({});
  };
  return (
    <div>
      <h1>Сторінка результатів пошуку</h1>
      <div className={`products-grid`}>
        {searchResults.map((el) => (
          <div key={el.id} className={`product-card `}>
            <div className={`product-image-wrapper`}>
              <img className={`product-image`} src={el.product_image} alt="" />
            </div>
            <div className={`product-card-footer`}>
              <h3>{el.product_name}</h3>
              <p>Price: {el.product_price}</p>
              {el.discount && <p>Знижка {el.Products.discount * 100}%</p>}

              <button
                type="button"
                onClick={() => buyButtonHandler({ ...el, inCartQuantity: 1 })}
              >
                Додати в корзину
              </button>
              <button type="button" onClick={() => productQtyHandler(el)}>
                Змінити кількість
              </button>
            </div>
          </div>
        ))}
        {isQtyModifierOpen && (
          <div className="product-quntity-popup">
            <p>{selectedProduct.product_name}</p>
            <button
              disabled={productQty < 2}
              onClick={() =>
                setProductQty((prev) => {
                  return prev - 1;
                })
              }
            >
              -
            </button>
            <span>{productQty}</span>
            <button
              onClick={() =>
                setProductQty((prev) => {
                  return prev + 1;
                })
              }
            >
              +
            </button>
            <button type="button" onClick={modifierHandler}>
              Додати в корзину
            </button>
            <button type="button" onClick={() => setIsQtyModifierOpen(false)}>
              Закрити
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
