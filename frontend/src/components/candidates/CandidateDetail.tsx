import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Button, Space, message, Spin } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { Candidate } from '../../types/candidate.types';
import api from '../../services/api';

interface CandidateDetailProps {
  candidateId: number;
  onEdit: (id: number) => void;
  onBack: () => void;
}

const CandidateDetail: React.FC<CandidateDetailProps> = ({
  candidateId,
  onEdit,
  onBack,
}) => {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCandidate();
  }, [candidateId]);

  const loadCandidate = async () => {
    try {
      setLoading(true);
      const data = await api.candidates.getById(candidateId);
      console.log('Datos del candidato cargados:', data); // Para debugging
      setCandidate(data);
    } catch (error: any) {
      console.error('Error al cargar candidato:', error); // Para debugging
      message.error('Error al cargar los detalles del candidato');
      onBack();
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin size="large" />;
  if (!candidate) return null;

  return (
    <Card
      title="Detalle del Candidato"
      extra={
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
            Volver
          </Button>
          <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit(candidateId)}>
            Editar
          </Button>
        </Space>
      }
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Nombre">{`${candidate.firstName} ${candidate.lastName}`}</Descriptions.Item>
        <Descriptions.Item label="Email">{candidate.email}</Descriptions.Item>
        <Descriptions.Item label="Teléfono">{candidate.phone || 'No especificado'}</Descriptions.Item>
        <Descriptions.Item label="Dirección">{candidate.address || 'No especificada'}</Descriptions.Item>
        <Descriptions.Item label="Estado">{candidate.status || 'DRAFT'}</Descriptions.Item>
        <Descriptions.Item label="Fecha de creación">
          {new Date(candidate.createdAt!).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Última actualización">
          {new Date(candidate.updatedAt!).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default CandidateDetail;
