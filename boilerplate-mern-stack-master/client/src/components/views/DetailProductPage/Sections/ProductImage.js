import React, {useEffect, useState} from 'react';
import ImageGallery from 'react-image-gallery'; // 슬라이드 라이브러리 임폴트 
function ProductImage(props) {  
      const [Images, setImages ] = useState([])
      useEffect(() => {
        if (props.detail.images && props.detail.images != undefined ) { // length가 왜 안되는지 이유 못찾음
            let images = []
            props.detail.images.map(item => {
                images.push({
                    original: `http://localhost:5000/${item}`,
                    thumbnail: `http://localhost:5000/${item}`
                })
            })
            setImages(images)
        }
    }, [props.detail])

    console.log(Images ,'데이터체크22220')
    return (
        <div>
            <ImageGallery items={Images} />
        </div>    
    )
}

export default ProductImage;