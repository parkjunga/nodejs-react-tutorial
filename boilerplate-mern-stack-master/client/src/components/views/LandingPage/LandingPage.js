import React , { useEffect , useState } from 'react' // import할 때  {} 로 둘러 쌓인 것은 해당 파일에서 그냥 export 한 것이고 중괄호 없는 건 default로 설정한 것이다.
import { FaCode } from "react-icons/fa";
import axios from 'axios';
import { Icon, Col, Card, Row, Carousel } from 'antd';
import Meta from 'antd/lib/card/Meta';
import CheckBox from './Section/CheckBox';
import RadioBox from './Section/RadioBox';
import SearchFeature from './Section/SearchFeature';
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
    const [searchTerm, setSearchTerm] = useState("")

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
                cover={<a href={`/product/${product._id}`}>
                    <ImageSlider images={product.images} /></a>
                 }>
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

    const handlePrice = (value) => {
        const data = price;
        let array = [];

        for (let key in data){
            if (data[key]._id == parseInt(value)) {
                array = data[key].array;
            }
        }
        return array;
    }
    const handleFiters = (filters,category) => {
        
        const newFilters = {...Filters} // continents랑 price가 들어있음
        newFilters[category] = filters

        if (category == 'price') {
            let priceValues = handlePrice(filters) 
            newFilters[category] = priceValues // [0,199] [200,249]... 
        }

        showFilteredResults(newFilters);
        setFilters(newFilters);
    }

    const updateSearchTerm = (newSearchTerm) => {
       
        let body = {
            skip:0,
            limit: Limit,
            filters: Filters, // state값에 따라 더해짐
            searchTerm: newSearchTerm
        }

        setSkip(0)
        setSearchTerm(newSearchTerm) // SearchFeautre 값이 넣어짐
        getProducts(body); // 이값에 맞게 서버에 처리해줘야됨.
    }

    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <h2>Let's Travel Anywhere <Icon type="rocket" /> </h2>
            </div>

            {/* Filter */}
            <Row gutter={[16,16]}>
                {/* CheckBox */}
                <Col lg={12} xs={24}>
                   <CheckBox list={continents} handleFiters={filters => handleFiters(filters, "continents")} />                    
                </Col>
                {/* RadioBox */}
                <Col lg={12} xs={24}>
                    <RadioBox list={price} handleFiters={filters => handleFiters(filters, "price")} />
                </Col>
            </Row>
            {/* Search */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '1rem auto'}}>
                <SearchFeature 
                     refreshFunction={updateSearchTerm}/>
            </div>
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
