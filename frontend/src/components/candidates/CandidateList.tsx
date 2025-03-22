import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Candidate } from '../../types/candidate.types';
import api from '../../services/api';

interface CandidateListProps {
  onEdit: (candidate: Candidate) => void;
  onView: (candidate: Candidate) => void;
}

const CandidateList: React.FC<CandidateListProps> = ({ onEdit, onView }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      console.log('Iniciando carga de candidatos...');
      const data = await api.candidates.getAll();
      console.log('Respuesta del servidor:', data);
      setCandidates(data);
      console.log('Candidatos actualizados en el estado:', data.length);
    } catch (error: any) {
      console.error('Error al cargar candidatos:', error);
      console.error('Detalles del error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      message.error(`Error al cargar los candidatos: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { 
      title: 'Nombre',
      key: 'fullName',
      render: (record: Candidate) => `${record.firstName} ${record.lastName}`
    },
    { 
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    { 
      title: 'Teléfono',
      dataIndex: 'phone',
      key: 'phone'
    },
    { 
      title: 'Dirección',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => status || 'DRAFT'
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: Candidate) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => onEdit(record)}
            title="Editar candidato"
          />
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => onView(record)}
            title="Ver detalles"
          />
        </Space>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={candidates} 
      rowKey="id" 
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
};

export default CandidateList;
