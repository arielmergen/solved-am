import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Upload, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Candidate, CandidateFormData, CandidateStatus } from '../../types/candidate.types';
import { candidateService } from '../../services/api';

interface CandidateFormProps {
  initialData?: Candidate;
  onSuccess?: (candidate: Candidate) => void;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ initialData, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const isEditing = !!initialData?.id;

  const onFinish = async (values: CandidateFormData) => {
    try {
      setLoading(true);
      let candidate: Candidate;

      if (isEditing && initialData.id) {
        // Actualizar candidato existente
        candidate = await candidateService.updateCandidate(initialData.id, values);
        message.success('Candidato actualizado correctamente');
      } else {
        // Crear nuevo candidato
        const newCandidate = {
          ...values,
          status: CandidateStatus.DRAFT
        };
        candidate = await candidateService.createCandidate(newCandidate);
        message.success('Candidato creado correctamente');
      }

      // Si hay un archivo CV para subir
      if (fileList.length > 0 && candidate.id) {
        const file = fileList[0].originFileObj;
        await candidateService.uploadCV(candidate.id, file);
        message.success('CV subido correctamente');
      }

      // Limpiar formulario si es nuevo
      if (!isEditing) {
        form.resetFields();
        setFileList([]);
      }

      // Llamar al callback de éxito si existe
      if (onSuccess) {
        onSuccess(candidate);
      }
    } catch (error) {
      console.error('Error al guardar candidato:', error);
      message.error('Error al guardar el candidato');
    } finally {
      setLoading(false);
    }
  };

  // Configuración para la carga de archivos
  const uploadProps = {
    beforeUpload: (file: File) => {
      const isPDF = file.type === 'application/pdf';
      const isDoc = file.type === 'application/msword' || 
                    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      
      if (!isPDF && !isDoc) {
        message.error('Solo se permiten archivos PDF, DOC o DOCX');
        return Upload.LIST_IGNORE;
      }
      
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('El archivo debe ser menor a 5MB');
        return Upload.LIST_IGNORE;
      }
      
      return false; // Prevenir la carga automática
    },
    fileList,
    onChange: ({ fileList }: any) => setFileList(fileList)
  };

  return (
    <Card title={isEditing ? 'Editar Candidato' : 'Nuevo Candidato'} style={{ maxWidth: 800, margin: '0 auto' }}>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialData || {}}
        onFinish={onFinish}
      >
        <Form.Item
          name="firstName"
          label="Nombre"
          rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}
        >
          <Input placeholder="Nombre del candidato" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Apellido"
          rules={[{ required: true, message: 'Por favor ingrese el apellido' }]}
        >
          <Input placeholder="Apellido del candidato" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Por favor ingrese el email' },
            { type: 'email', message: 'Por favor ingrese un email válido' }
          ]}
        >
          <Input placeholder="Email del candidato" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Teléfono"
          rules={[{ required: true, message: 'Por favor ingrese el teléfono' }]}
        >
          <Input placeholder="Teléfono del candidato" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Dirección"
        >
          <Input.TextArea placeholder="Dirección del candidato" rows={3} />
        </Form.Item>

        <Form.Item
          label="CV"
          name="cv"
        >
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Seleccionar CV (PDF, DOC, DOCX)</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditing ? 'Actualizar' : 'Guardar'}
            </Button>
            {isEditing && initialData.status === CandidateStatus.DRAFT && (
              <Button 
                type="default" 
                onClick={async () => {
                  try {
                    setLoading(true);
                    const published = await candidateService.publishCandidate(initialData.id!);
                    message.success('Candidato publicado correctamente');
                    if (onSuccess) onSuccess(published);
                  } catch (error) {
                    console.error('Error al publicar candidato:', error);
                    message.error('Error al publicar el candidato');
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Publicar
              </Button>
            )}
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CandidateForm; 