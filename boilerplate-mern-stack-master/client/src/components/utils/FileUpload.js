import React, {useState} from 'react';
import Dropzone from 'react-dropzone';
import { Icon} from 'antd';
import axios from 'axios';

function FileUpload(props){

    const [Images, setImages] =useState([])

    const dropHandler = (files) => {

        let formData = new FormData();

        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append('file',files[0]) // header랑 formData랑 같이 보내지않을경우 error가 발생하니 주의!
        
        // backend로 파일정보전달
        axios.post('/api/product/image', formData , config)
        .then(response => {
            if(response.data.success) {
                console.log(response.data);
                setImages([...Images, response.data.filePath]) // 기존 이미지에 새로 추가한 이미지까지 
                props.refreshFunction([...Images, response.data.filePath]) // 이미지 state가 변경되는 것을 부모 컴포넌트에도 전달해주기위해 prop에서 상태값 전달
            } else {
                alert('파일을 저장하는데 실패하였습니다.')
            }
        })
    }

    const deleteHandler = (image) => {
        const currentIndex =  Images.indexOf(image) // 삭제할 index 확인 

        let newImages = [...Images] // 새롭게 이미지 복사한것을 담고 
        newImages.splice(currentIndex,1) // 삭제할 인덱스를 선택해서 1개를 제거  (삭제할인덱스번호, 그 번호부터 몇개를 지울지)

        setImages(newImages);
        props.refreshFunction(newImages);
    }

    return (
        <div style={{ display:'flex', justifyContent: 'space-between'}}>
            <Dropzone onDrop={dropHandler}>
                {({ getRootProps, getInputProps}) => (
                    <div 
                    style={{ width:300, height: 240, border: '1px solid lightgray',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Icon type="plus" style={{fontSize: '3rem'}} />
                    </div>
                )}
            </Dropzone>
            <div style={{ display:'flex', width:'350px', height:'240px', overflowX:'scroll'}}>
                    {Images.map((image,index) => (
                        <div onClick={() => deleteHandler(image)} key={index}>
                            <img style={{ minWidth:'300px', width:'300px', height: '240px'}} 
                                src={`http://localhost:5000/${image}`} />
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default FileUpload;