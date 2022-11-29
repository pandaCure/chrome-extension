/* eslint-disable no-undef */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState } from 'react';
import { Card, Form, Radio, Select, Input, Divider, Button, Modal } from '@arco-design/web-react';
import { IconPlus } from '@arco-design/web-react/icon';
import { get } from 'lodash';
const Option = Select.Option;
const laneDefault = ['boe_prod', 'boe_open_new', 'boe_open_new_v2'];
const App = () => {
  const [form] = Form.useForm();
  const [options, setOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const addItem = () => {
    if (inputValue && options.indexOf(inputValue) === -1) {
      setOptions(options.concat([inputValue]));
      setInputValue('');
    }
  };
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      chrome.storage.sync.get((result) => {
        const lane = get(result, 'lane', []);
        setOptions(Array.from(new Set([...(Array.isArray(lane) ? lane : [lane]), ...laneDefault])));
        form.setFieldValue('lane', lane);
      });
    }
  }, []);
  const handleSave = () => {
    form.validate().then(() => {
      const params = form.getFields();
      console.log(`params`, params);
      chrome.storage.sync.set(params, () => {
        Modal.success({ title: '设置成功', content: '' });
      });
    });
  };
  const handleFromChange = (field: any) => {
    if (field.env) {
      form.resetFields('lane')
      setOptions(prev => prev.map(v => {
        const newV = v.split('_').slice(1)
        newV.unshift(field.env)
        return newV.join("_")
      }))
    }
  };
  return (
    <div className="rounded-sm shadow-md flex justify-center p-6 pt-0">
      <Card title="定制" style={{ width: '500px' }}>
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
            <Select
              mode="multiple"
              style={{ width: 240 }}
              placeholder="请选择泳道"
              dropdownRender={(menu) => (
                <div>
                  {menu}
                  <Divider style={{ margin: 0 }} />
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 12px',
                    }}
                  >
                    <Input
                      size="small"
                      style={{ marginRight: 18 }}
                      value={inputValue}
                      onChange={(value) => setInputValue(value)}
                    />
                    <Button style={{ fontSize: 14, padding: '0 6px' }} type="text" size="mini" onClick={addItem}>
                      <IconPlus />
                      增加泳道
                    </Button>
                  </div>
                </div>
              )}
              dropdownMenuStyle={{ maxHeight: 100 }}
            >
              {options.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button onClick={handleSave}>保存</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default App;
