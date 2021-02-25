import React , { useEffect , useState } from 'react' // import할 때  {} 로 둘러 쌓인 것은 해당 파일에서 그냥 export 한 것이고 중괄호 없는 건 default로 설정한 것이다.
import { FaCode } from "react-icons/fa";
import axios from 'axios';
import { Icon, Col, Card, Row, Carousel } from 'antd';
import Meta from 'antd/lib/card/Meta';
import CheckBox from './Section/CheckBox';
import ImageSlider from '../../utils/ImageSlider';
import { continents, price } from './Section/Datas';

function LandingPage() {

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0) // 더보기외에 더 가져올것이 없을때 버튼 안보이게하기위해 
    const [Filters, setFilters] = useState({
        continents: [],
        price: []
    })

    useEffect(() => {

        let body = {
            skip: Skip,
            limit: Limit
        }
        
        // 처음호출
        getProducts(body);

    }, [])

    const getProducts = (body) => {
        // backend에서 데이터를 가져와야됨
        axios.post('/api/product/products', body)
            .then(response => {
                if (response.data.success) {
                    if (body.loadMore) { // 더보기 눌렀을때 
                        setProducts([...Products, ...response.data.productInfo])
                    } else {
                        setProducts(response.data.productInfo);
                    }
                    console.log(response.data.postSize);
                    setPostSize(response.data.postSize);
                } else {
                    alert('상품들을 가져오는데 실패 하였습니다.');
                }
            })
    }

    // 더보기
    const loadMoreHanlder = () => {
        
        let skip = Skip + Limit
        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true
        }

        getProducts(body)
        setSkip(skip); // 호출후 변경된 스킵값을 넣어줘야됨 
    } 

    const renderCards =  Products.map((product, index) => {
        return <Col lg={6} md={8} xs={24} key={index}>
            {/** 이미지 슬라이드는 따로 빼서 ImageSlider 컴포넌트엥 따로 넣는다 */}
            <Card
                cover={<ImageSlider images={product.images} />}
            >
                <Meta 
                    title={product.title}
                    description={`$${product.price}`}
                />
            </Card>
        </Col>
    })

    const showFilteredResults = (filters) => {

        let body = {
            skip: 0,
            limit: Limit,
            filters:filters
        }

        getProducts(body);
        setSkip(0)
    }

    const handleFiters = (filters,category) => {
        
        const newFilters = {...Filters} // continents랑 price가 들어있음
        newFilters[category] = filters

        showFilteredResults(newFilters)
    }

    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <h2>Let's Travel Anywhere <Icon type="rocket" /> </h2>
            </div>

            {/* Filter */}

            {/* CheckBox */}
                <CheckBox list={continents} handleFiters={filters => handleFiters(filters, "continents")} />
            {/* RadioBox */}
            {/* Search */}

            {/* Cards  */}   

            <Row gutter={[16,16]}>
                {renderCards}
            </Row>

            <br/>

            {PostSize >= Limit &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={loadMoreHanlder}>더보기</button>
                </div>
            }

 
        </div>
    )
}

export default LandingPage
