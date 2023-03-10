import React, { useState, useRef, useEffect } from 'react';
import { Button, message, Alert } from 'antd';
import { editor } from 'monaco-editor';
import hiveSource from './jsonSample/hiveSource';
import oracleSource from './jsonSample/oracleSource';
import Editor from './editor';
import FormDemo from './formDemo';
import './styles/app.css';
import './styles/ant-cover.css';

const Page: React.FC<any> = () => {
    const [parsedJson, updateParsedJson] = useState([]);
    const [source, updateSource] = useState<{
        sourceId: number;
        sourceType: string;
    }>({ sourceId: undefined, sourceType: undefined });
    const editorRef = useRef<editor.IStandaloneCodeEditor>(null);

    useEffect(() => {
        const { sourceType } = source;
        if (!editorRef.current) return;
        if (sourceType === 'hive') {
            updateParsedJson([...hiveSource]);
            editorRef.current.setValue(JSON.stringify(hiveSource, null, 2));
        } else if (sourceType === 'oracle') {
            updateParsedJson([...oracleSource]);
            editorRef.current.setValue(JSON.stringify(oracleSource, null, 2));
        }
    }, [source.sourceType, source.sourceId]);

    const refresh = () => {
        let parsedJson;
        try {
            parsedJson = JSON.parse(editorRef.current.getValue());
        } catch (error) {
            console.error(error);
            message.error('json 解析失败！');
        }
        updateParsedJson(parsedJson ?? []);
    };

    const changeParsedJson = (sourceId, sourceType) => {
        updateSource({ sourceId, sourceType });
    };

    return (
        <div className="page">
            <div className="page-header">
                <Alert
                    message="demo 已经内置了 hive 和 oracle 两种数据源作为来源时的配置，选择数据源，左侧编辑器就会自动出现对应的配置，编辑配置，并点击 refresh 按钮，表单会根据编辑器内容重新渲染！"
                    type="info"
                    showIcon
                />
                <Button type="primary" onClick={refresh}>
                    refresh
                </Button>
            </div>
            <div className="page-container">
                <div className="editor-wrapper">
                    <Editor
                        language="json"
                        ref={(r) => (editorRef.current = r?._monacoInstance)}
                    />
                </div>
                <div className="form-wrapper">
                    <FormDemo
                        changeParseJson={changeParsedJson}
                        parsedJson={parsedJson}
                    />
                </div>
            </div>
        </div>
    );
};
export default Page;
