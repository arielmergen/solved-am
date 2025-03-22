import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Candidate } from '../../types/candidate.types';
import api from '../../services/api';

interface CandidateFormProps {
  initialData?: Candidate;
  onSuccess: () => void;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ initialData, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: Candidate) => {
    try {
      setLoading(true);
      if (initialData?.id) {
        await api.candidates.update(initialData.id, values);
        message.success('Candidato actualizado exitosamente');
      } else {
        await api.candidates.create(values);
        message.success('Candidato creado exitosamente');
      }
      onSuccess();
    } catch (error: any) {
      message.error(error.response?.data?.error || 'Error al guardar el candidato');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialData}
      onFinish={onFinish}
      style={{ maxWidth: 600, margin: '0 auto' }}
    >
      <Form.Item
        name="firstName"
        label="Nombre"
        rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="lastName"
        label="Apellido"
        rules={[{ required: true, message: 'Por favor ingrese el apellido' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Por favor ingrese el email' },
          { type: 'email', message: 'Por favor ingrese un email válido' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Teléfono"
        rules={[{ pattern: /^\+?[0-9]{10,15}$/, message: 'Por favor ingrese un teléfono válido' }]}
      >
        <Input placeholder="+1234567890" />
      </Form.Item>

      <Form.Item
        name="address"
        label="Dirección"
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialData ? 'Actualizar' : 'Crear'} Candidato
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CandidateForm;
