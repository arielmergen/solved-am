import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, FileOutlined } from '@ant-design/icons';
import { Candidate, CandidateStatus } from '../../types/candidate.types';
import { candidateService } from '../../services/api';

interface CandidateListProps {
  onEdit?: (candidate: Candidate) => void;
  onView?: (candidate: Candidate) => void;
}

const CandidateList: React.FC<CandidateListProps> = ({ onEdit, onView }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const data = await candidateService.getAllCandidates();
      setCandidates(data);
    } catch (error) {
      console.error('Error al obtener candidatos:', error);
      message.error('Error al cargar los candidatos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await candidateService.deleteCandidate(id);
      message.success('Candidato eliminado correctamente');
      fetchCandidates();
    } catch (error) {
      console.error('Error al eliminar candidato:', error);
      message.error('Error al eliminar el candidato');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id: number) => {
    try {
      setLoading(true);
      await candidateService.publishCandidate(id);
      message.success('Candidato publicado correctamente');
      fetchCandidates();
    } catch (error) {
      console.error('Error al publicar candidato:', error);
      message.error('Error al publicar el candidato');
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status: CandidateStatus) => {
    switch (status) {
      case CandidateStatus.DRAFT:
        return <Tag color="blue">Borrador</Tag>;
      case CandidateStatus.ACTIVE:
        return <Tag color="green">Activo</Tag>;
      case CandidateStatus.INACTIVE:
        return <Tag color="red">Inactivo</Tag>;
      default:
        return <Tag>Desconocido</Tag>;
    }
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (text: string, record: Candidate) => `${record.firstName} ${record.lastName}`
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Teléfono',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: CandidateStatus) => getStatusTag(status)
    },
    {
      title: 'CV',
      key: 'cv',
      render: (text: string, record: Candidate) => (
        record.cvPath ? (
          <a href={record.cvPath} target="_blank" rel="noopener noreferrer">
            <FileOutlined /> Ver CV
          </a>
        ) : (
          <span>No disponible</span>
        )
      )
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (text: string, record: Candidate) => (
        <Space size="middle">
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => onView && onView(record)}
            title="Ver detalles"
          />
          <Button 
            icon={<EditOutlined />} 
            onClick={() => onEdit && onEdit(record)}
            title="Editar"
          />
          {record.status === CandidateStatus.DRAFT && (
            <Button 
              type="primary"
              onClick={() => handlePublish(record.id!)}
              disabled={!record.id}
            >
              Publicar
            </Button>
          )}
          <Popconfirm
            title="¿Está seguro de eliminar este candidato?"
            onConfirm={() => record.id && handleDelete(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />}
              title="Eliminar"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={candidates.map(c => ({ ...c, key: c.id }))} 
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
};

export default CandidateList; 