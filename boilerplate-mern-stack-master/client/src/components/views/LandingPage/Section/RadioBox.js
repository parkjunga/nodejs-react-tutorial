import React, { useState } from 'react';
import { Collapse, Radio } from 'antd'; 

const { Panel } = Collapse;

function RadioBox(props) {


    const [Value,setValue] = useState(0)

    // price들의 데이터들이 들어있음
    const renderRadioBoax = () => (
        props.list && props.list.map(value => (
            <Radio key={value._id} value={value._id}>{value.name}</Radio>
        ))
    )

    // 라디오클릭시 작동해서 value 값이 변경된다.
    const handleChange = (event) => {
        setValue(event.target.value)
        props.handleFiters(event.target.value)
    }

    return (
        <div>
            <Collapse defaultActiveKey={['0']} >
                <Panel header="Price" key="1">
                    <Radio.Group onChange={handleChange} value={Value}>
                    {renderRadioBoax()}
                    </Radio.Group>
                </Panel>
            </Collapse>
        </div>
    )
}

export default RadioBox