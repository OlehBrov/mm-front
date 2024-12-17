import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import QRCode from "react-qr-code";
import { selectReciept } from "../redux/selectors/selectors";
import Scrollbars from "react-custom-scrollbars-2";
import { clearBuyStatus } from "../redux/features/buyStatus";
import { useNavigate } from "react-router-dom";
import { clearReciept } from "../redux/features/recieptSlice";

const CHECK_FLOW = {
  1: "продаж",
  2: "повернення",
  3: "сервісне внесення",
  4: "сервісне винесення",
  14: "видача готівки",
  15: "переказ коштів",
  16: "видача готівки при переказі",
};

export const Reciept = () => {
  const taxData = useSelector(selectReciept);
  const [reciept, setReciept] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (taxData) {
      async function fetchData() {
        const response = await fetch(
          `http://localhost:6006/api/reciept-proxy/${taxData.info.doccode}`
        );
        console.log("await response", await response);
        const { data } = await response.json();
        console.log("data", data);
        setReciept(data);
      }

      fetchData();
    }
  }, [taxData]);

  useEffect(() => {
    console.log("reciept", reciept);
    if (reciept) {
      setQrCode(reciept.qr_content);
      console.log("reciept.data.items", reciept.data.items);
    }
  }, [reciept]);
  const closeRecieptHandler = () => {
    dispatch(clearBuyStatus());
    dispatch(clearReciept());
    navigate("/products");
  };
  if (!reciept)
    return (
      <div className="total-check-wrapper">
        <h1>Завантаження чеку</h1>
      </div>
    );
  if (reciept) {
    return (
      <div className="total-check-wrapper">
        <button
          className="check-close-button filled-text-button"
          onClick={closeRecieptHandler}
        >
          Закрити
        </button>
        <Scrollbars
          renderTrackVertical={(props) => (
            <div {...props} className="track-vertical" />
          )}
          renderThumbVertical={(props) => (
            <div {...props} className="thumb-vertical" />
          )}
          style={{ width: 600}}
          thumbSize={190}
          autoHeight
          autoHeightMin={400}
          autoHeightMax={1500}
          universal={true}
          hideTracksWhenNotNeeded={true}
        >
          <div className="check">
            {reciept.is_test && (
              <div className="testCheckInfo">
                <span>ТЕСТОВИЙ ЧЕК Не передається в податкову</span>
              </div>
            )}

            <div className="check-header">
              <h4>{reciept.company_name}</h4>
              <p>{reciept.shop_name}</p>
              <p>{reciept.shop_address}</p>
              <p>ІД {reciept.company_edrpou}</p>
            </div>
            <div className="divider"></div>

            <div className="topComment">Ваші покупки</div>
            <div className="check-items-list">
              {reciept.data.items.map((item) => {
                return (
                  <div className="check-list-item" key={item.code1}>
                    <div className="product-line check-product-qty">
                      <p>
                        {item.cnt} X {item.price}
                      </p>
                    </div>
                    <div className="product-line check-barcode-line">
                      <p>Штрихкод</p>
                      <p>{item.code1}</p>
                    </div>
                    <div className="product-line check-product-name">
                      <p>{item.name}</p>
                      <div className="price-tax-wrap">
                        <p>{item.price}</p>
                        <p>{item.tg_print}</p>
                      </div>
                    </div>
                    {item.discount && (
                      <div className="product-line check-product-discount">
                        <p>Знижка</p>
                        <div className="price-tax-wrap">
                          <p>{item.discount.sum}</p>
                          <p>{item.discount.tg_print}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="divider"></div>
            <div className="check-tech-data-wrapper">
              <div className="check-tech-text-wrapper">
                <p>{CHECK_FLOW[reciept.data.check_type]}</p>
              </div>
              <div className="check-tech-text-wrapper">
                <p>{reciept.data.pays[0].bank_id}</p>
              </div>
              <div className="check-tech-text-wrapper">
                <p>Термінал</p>
                <p>{reciept.data.pays[0].term_id}</p>
              </div>
              <div className="check-tech-text-wrapper">
                <p>Вид операції</p>
                <p>{reciept.data.pays[0].operation}</p>
              </div>
              <div className="check-tech-text-wrapper">
                <p>ЕПЗ</p>
                <p>{reciept.data.pays[0].cardmask}</p>
              </div>
              <div className="check-tech-text-wrapper">
                <p>Код авторизації</p>
                <p>{reciept.data.pays[0].auth_code}</p>
              </div>
              <div className="check-tech-text-wrapper">
                <p>Платіжна система</p>
                <p>{reciept.data.pays[0].paysys}</p>
              </div>
              <div className="check-tech-text-wrapper">
                <p>RRN</p>
                <p>{reciept.data.pays[0].rrn}</p>
              </div>
              <div className="check-tech-text-wrapper">
                <p>Касир</p>
              </div>
              <div className="check-tech-text-wrapper">
                <p>Держатель ЕПЗ</p>
              </div>

              <div className="check-tech-text-wrapper">
                <p>{reciept.data.pays[0].name}</p>
                <p>{reciept.data.pays[0].pay_sum}</p>
              </div>
            </div>
            <div className="divider"></div>
            <div className="check-payment-data-wrapper">
              <div className="check-payment-text-wrapper">
                <p>Сума</p>
                <p>{reciept.data.close.sum}</p>
              </div>
              <div className="check-payment-text-wrapper">
                <div className="price-tax-wrap">
                  <p>{reciept.data.taxes[0].tg_name}</p>
                  <p>{reciept.data.taxes[0].tg_print}</p>
                </div>

                <p>{reciept.data.taxes[0].tax_sum}</p>
              </div>
              <div className="check-payment-text-wrapper">
                <p>До сплати</p>
                <p>{reciept.data.close.to_pay}</p>
              </div>
            </div>
            <div className="divider"></div>
            <div className="check-comments-wrapper">
              <p>Коментар</p>
              <p>{reciept.data.last_comment[0]}</p>
            </div>
            <div className="divider"></div>
            <div className="check-fiscals-wrapper">
              <div className="check-fiscals-text-wrapper">
                <p>Фіск. номер чека:</p>
                <p>{reciept.fiscal_number}</p>
              </div>
              <div className="check-fiscals-text-wrapper">
                <p>{reciept.data.date}</p>
              </div>
            </div>
            <div className="divider"></div>
            {qrCode && (
              <div className="check-qr-wrapper">
                <div
                  style={{
                    height: "auto",
                    margin: "0 auto",
                    maxWidth: 200,
                    width: "100%",
                  }}
                >
                  <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={qrCode}
                    viewBox={`0 0 256 256`}
                  />
                </div>
              </div>
            )}
            <div className="divider"></div>
            <div className="check-footer">
              <div className="text-wrapper footer-text-wrapper">
                <p>Режим роботи</p>
                <p>{reciept.is_offline ? "Офлайн" : "Онлайн"}</p>
              </div>
              <div className="text-wrapper footer-text-wrapper">
                <p>ФН ПРРО</p>
                <p>{reciept.rro_fiscal_number}</p>
              </div>
            </div>
          </div>
        </Scrollbars>
      </div>
    );
  }
};
