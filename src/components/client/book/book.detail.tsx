/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Row, Col, Rate, Divider, message } from "antd";
import ImageGallery from "react-image-gallery";
import { useEffect, useRef, useState } from "react";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { BsCartPlus } from "react-icons/bs";
import "styles/book.scss";
import ModalGallery from "./modal.gallery";
import { useCurrentApp } from "@/components/context/app.context";

interface IProps {
  currentBook: IBookTable | null;
}

type UserAction = "MINUS" | "PLUS";

const BookDetail = (props: IProps) => {
  const { currentBook } = props;
  const [imageGallery, setImageGallery] = useState<
    {
      original: string;
      thumbnail: string;
      originalClass: string;
      thumbnailClass: string;
    }[]
  >([]);

  const [isOpenModalGallery, setIsOpenModalGallery] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuantity, setCurrentQuantity] = useState<number>(1);

  const { carts, setCarts } = useCurrentApp();

  const refGallery = useRef<ImageGallery>(null);

  //   const images = [
  //     {
  //       original: "https://picsum.photos/id/1018/1000/600/",
  //       thumbnail: "https://picsum.photos/id/1018/250/150/",
  //       originalClass: "original-image",
  //       thumbnailClass: "thumbnail-image",
  //     },
  //     {
  //       original: "https://picsum.photos/id/1015/1000/600/",
  //       thumbnail: "https://picsum.photos/id/1015/250/150/",
  //       originalClass: "original-image",
  //       thumbnailClass: "thumbnail-image",
  //     },
  //     {
  //       original: "https://picsum.photos/id/1019/1000/600/",
  //       thumbnail: "https://picsum.photos/id/1019/250/150/",
  //       originalClass: "original-image",
  //       thumbnailClass: "thumbnail-image",
  //     },
  //     {
  //       original: "https://picsum.photos/id/1018/1000/600/",
  //       thumbnail: "https://picsum.photos/id/1018/250/150/",
  //       originalClass: "original-image",
  //       thumbnailClass: "thumbnail-image",
  //     },
  //     {
  //       original: "https://picsum.photos/id/1015/1000/600/",
  //       thumbnail: "https://picsum.photos/id/1015/250/150/",
  //       originalClass: "original-image",
  //       thumbnailClass: "thumbnail-image",
  //     },
  //     {
  //       original: "https://picsum.photos/id/1019/1000/600/",
  //       thumbnail: "https://picsum.photos/id/1019/250/150/",
  //       originalClass: "original-image",
  //       thumbnailClass: "thumbnail-image",
  //     },
  //     {
  //       original: "https://picsum.photos/id/1018/1000/600/",
  //       thumbnail: "https://picsum.photos/id/1018/250/150/",
  //       originalClass: "original-image",
  //       thumbnailClass: "thumbnail-image",
  //     },
  //     {
  //       original: "https://picsum.photos/id/1015/1000/600/",
  //       thumbnail: "https://picsum.photos/id/1015/250/150/",
  //       originalClass: "original-image",
  //       thumbnailClass: "thumbnail-image",
  //     },
  //     {
  //       original: "https://picsum.photos/id/1019/1000/600/",
  //       thumbnail: "https://picsum.photos/id/1019/250/150/",
  //       originalClass: "original-image",
  //       thumbnailClass: "thumbnail-image",
  //     },
  //   ];

  useEffect(() => {
    if (currentBook) {
      //build images
      const images = [];
      if (currentBook.thumbnail) {
        images.push({
          original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            currentBook.thumbnail
          }`,
          thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            currentBook.thumbnail
          }`,
          originalClass: "original-image",
          thumbnailClass: "thumbnail-image",
        });
      }
      if (currentBook.slider) {
        currentBook.slider?.map((item) => {
          images.push({
            original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
            thumbnail: `${
              import.meta.env.VITE_BACKEND_URL
            }/images/book/${item}`,
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image",
          });
        });
      }
      setImageGallery(images);
    }
  }, [currentBook]);

  const handleOnClickImage = () => {
    //get current index onClick
    setIsOpenModalGallery(true);
    setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
  };

  const handleChangeQuantity = (type: UserAction) => {
    if (type === "MINUS") {
      if (currentQuantity - 1 <= 0) return;
      setCurrentQuantity(currentQuantity - 1);
    }
    if (type === "PLUS" && currentBook) {
      if (currentQuantity === +currentBook.quantity) return; // max
      setCurrentQuantity(currentQuantity + 1);
    }
  };

  const handleChangeInput = (value: string) => {
    // use plus to convert string to number (eg: "7" => 7)
    if (!isNaN(+value)) {
      if (+value > 0 && currentBook && +value <= +currentBook.quantity) {
        setCurrentQuantity(+value);
      }
    }
  };

  const handleAddToCart = () => {
    //update localStorage
    const cartStorage = localStorage.getItem("carts");
    if (cartStorage && currentBook) {
      //update
      const carts = JSON.parse(cartStorage) as ICart[];

      //check exist
      let isExistIndex = carts.findIndex((c) => c._id === currentBook?._id);
      if (isExistIndex > -1) {
        carts[isExistIndex].quantity =
          carts[isExistIndex].quantity + currentQuantity;
      } else {
        carts.push({
          _id: currentBook._id,
          quantity: currentQuantity,
          detail: currentBook,
        });
      }
      localStorage.setItem("carts", JSON.stringify(carts));

      //sync React Context
      setCarts(carts);
    } else {
      // create
      const data = [
        {
          _id: currentBook?._id!,
          quantity: currentQuantity,
          detail: currentBook!,
        },
      ];
      localStorage.setItem("carts", JSON.stringify(data));

      //sync React Context
      setCarts(data);
    }
    message.success("Thêm sản phẩm vào giỏ hàng thành công")
  };
  console.log(carts);

  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="view-detail-book"
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          minHeight: "calc(100vh - 150px)",
        }}
      >
        <div style={{ padding: "20px", background: "#fff", borderRadius: 5 }}>
          <Row gutter={[20, 20]}>
            <Col md={10} sm={0} xs={0}>
              <ImageGallery
                ref={refGallery}
                items={imageGallery}
                showPlayButton={false} //hide play button
                showFullscreenButton={false} //hide fullscreen button
                renderLeftNav={() => <></>} //left arrow === <> </>
                renderRightNav={() => <></>} //right arrow === <> </>
                slideOnThumbnailOver={true} //onHover => auto scroll images
                onClick={() => handleOnClickImage()}
              />
            </Col>
            <Col md={14} sm={24}>
              <Col md={0} sm={24} xs={24}>
                <ImageGallery
                  ref={refGallery}
                  items={imageGallery}
                  showPlayButton={false} //hide play button
                  showFullscreenButton={false} //hide fullscreen button
                  renderLeftNav={() => <></>} //left arrow === <> </>
                  renderRightNav={() => <></>} //right arrow === <> </>
                  showThumbnails={false}
                />
              </Col>
              <Col span={24}>
                <div className="author">
                  Tác giả: <a href="#">{currentBook?.author}</a>{" "}
                </div>
                <div className="title">{currentBook?.mainText}</div>
                <div className="rating">
                  <Rate
                    value={5}
                    disabled
                    style={{ color: "#ffce3d", fontSize: 12 }}
                  />
                  <span className="sold">
                    <Divider type="vertical" />
                    Đã bán {currentBook?.sold ?? 0}
                  </span>
                </div>
                <div className="price">
                  <span className="currency">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(currentBook?.price ?? 0)}
                  </span>
                </div>
                <div className="delivery">
                  <div>
                    <span className="left">Vận chuyển</span>
                    <span className="right">Miễn phí vận chuyển</span>
                  </div>
                </div>
                <div className="quantity">
                  <span className="left">Số lượng</span>
                  <span className="right">
                    <button onClick={() => handleChangeQuantity("MINUS")}>
                      <MinusOutlined />
                    </button>
                    <input
                      defaultValue={1}
                      onChange={(event) =>
                        handleChangeInput(event.target.value)
                      }
                      value={currentQuantity}
                    />
                    <button onClick={() => handleChangeQuantity("PLUS")}>
                      <PlusOutlined />
                    </button>
                  </span>
                </div>
                <div className="buy">
                  <button className="cart" onClick={() => handleAddToCart()}>
                    <BsCartPlus className="icon-cart" />
                    <span>Thêm vào giỏ hàng</span>
                  </button>
                  <button className="now">Mua ngay</button>
                </div>
              </Col>
            </Col>
          </Row>
        </div>
      </div>
      <ModalGallery
        isOpen={isOpenModalGallery}
        setIsOpen={setIsOpenModalGallery}
        currentIndex={currentIndex}
        items={imageGallery}
        title={currentBook?.mainText ?? ""}
      />
    </div>
  );
};

export default BookDetail;
