import React, {useEffect} from 'react';
import axios from 'axios';

function SearchFeature(props) {
    
    const productId = props.match.params.productId

    useEffect(() => {

        axios.get(`/api/product/products_by_id?id=${productId}&type=single`) // 한개만 가져오니 singe로 
             .then(response => {
                 if (response.data.success) {
                    console.log('데이터 =>',response.data)
                 } else {
                     console.log(response);
                     alert('상세 정보 가져오기를 실패했습니다.')
                 }
             })
    }, [])

    return (
        <div>

        </div>
    )
}

export default SearchFeature;