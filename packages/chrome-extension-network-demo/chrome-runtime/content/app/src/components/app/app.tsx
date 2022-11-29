/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect } from 'react';
import { Button, Form, Modal, Radio, Select } from '@arco-design/web-react';
import { useState } from 'react';
import { get } from 'lodash';
const Option = Select.Option;
const App = () => {
  const hanldeGlobalClick = () => {
    chrome.runtime.sendMessage({ from: 'jump' })
    
  };
  const [visible, setVisible] = useState(false);
  const handOnClick = () => {
    form.validate().then(() => {
      const params = form.getFields();
      console.log(`params`, params);
      chrome.runtime.sendMessage({ from: 'proxy', params }, () => {
        chrome.storage.sync.set(params, () => {
          Modal.success({ title: '设置成功', content: '' });
        });
      });
    });
    setVisible(false);
  };
  const [form] = Form.useForm();
  const [options, setOptions] = useState<string[]>([]);
  const handleFromChange = (field: any) => {
    if (field.env) {
      form.resetFields('lane');
      setOptions((prev) =>
        prev.map((v) => {
          const newV = v.split('_').slice(1);
          newV.unshift(field.env);
          return newV.join('_');
        }),
      );
    }
  };
  useEffect(() => {
    console.log(1111);
    if (process.env.NODE_ENV === 'production') {
      chrome.storage.sync.get((result) => {
        console.log(result);
        const lane = get(result, 'lane', []);
        setOptions(Array.from(new Set([...(Array.isArray(lane) ? lane : [lane])])));
        // form.setFieldValue('lane', lane);
      });
    }
  }, []);
  return (
    <div className="flex flex-col">
      <Button onClick={() => setVisible(true)}>配置泳道</Button>
      <Button onClick={hanldeGlobalClick}>全局配置</Button>
      <Modal title="配置泳道" visible={visible} onOk={handOnClick} onCancel={() => setVisible(false)} closable>
        <Form
          form={form}
          initialValues={{ env: 'boe' }}
          labelCol={{
            span: 3,
          }}
          onChange={handleFromChange}
        >
          <Form.Item label="环境" field="env" required>
            <Radio.Group>
              <Radio value="boe">BOE</Radio>
              <Radio value="ppe">PPE</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="泳道" field="lane" required>
            <Select style={{ width: 240 }} placeholder="请选择泳道" allowCreate>
              {options.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default App;
