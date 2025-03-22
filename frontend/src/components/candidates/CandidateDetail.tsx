import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Timeline, Tag, Spin, Button, message } from 'antd';
import { ClockCircleOutlined, FileOutlined } from '@ant-design/icons';
import { Candidate, CandidateStatus, HistoryChange } from '../../types/candidate.types';
import { candidateService } from '../../services/api';

interface CandidateDetailProps {
  candidateId: number;
  onEdit?: (candidate: Candidate) => void;
  onBack?: () => void;
}

const CandidateDetail: React.FC<CandidateDetailProps> = ({ candidateId, onEdit, onBack }) => {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCandidate = async () => {
    try {
      setLoading(true);
      const data = await candidateService.getCandidate(candidateId);
      setCandidate(data);
    } catch (error) {
      console.error('Error al obtener candidato:', error);
      message.error('Error al cargar los datos del candidato');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (candidateId) {
      fetchCandidate();
    }
  }, [candidateId]);

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

  const renderHistoryTimeline = () => {
    if (!candidate?.history || candidate.history.length === 0) {
      return <p>No hay historial disponible</p>;
    }

    return (
      <Timeline mode="left">
        {candidate.history.map((entry) => {
          const changes: HistoryChange[] = JSON.parse(entry.changes);
          const date = new Date(entry.createdAt).toLocaleString();

          return (
            <Timeline.Item 
              key={entry.id} 
              dot={<ClockCircleOutlined />}
              label={date}
            >
              <p><strong>{entry.changeType}</strong></p>
              <ul>
                {changes.map((change, index) => (
                  <li key={index}>
                    <strong>{change.field}:</strong> {change.oldValue} → {change.newValue}
                  </li>
                ))}
              </ul>
            </Timeline.Item>
          );
        })}
      </Timeline>
    );
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!candidate) {
    return <p>No se encontró el candidato</p>;
  }

  return (
    <div>
      <Card 
        title="Detalles del Candidato"
        extra={
          <div>
            <Button onClick={onBack} style={{ marginRight: 8 }}>
              Volver
            </Button>
            <Button type="primary" onClick={() => onEdit && onEdit(candidate)}>
              Editar
            </Button>
          </div>
        }
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Nombre">{candidate.firstName}</Descriptions.Item>
          <Descriptions.Item label="Apellido">{candidate.lastName}</Descriptions.Item>
          <Descriptions.Item label="Email">{candidate.email}</Descriptions.Item>
          <Descriptions.Item label="Teléfono">{candidate.phone || 'No disponible'}</Descriptions.Item>
          <Descriptions.Item label="Dirección">{candidate.address || 'No disponible'}</Descriptions.Item>
          <Descriptions.Item label="Estado">{getStatusTag(candidate.status)}</Descriptions.Item>
          <Descriptions.Item label="CV">
            {candidate.cvPath ? (
              <a href={candidate.cvPath} target="_blank" rel="noopener noreferrer">
                <FileOutlined /> Ver CV
              </a>
            ) : (
              'No disponible'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Fecha de creación">
            {new Date(candidate.createdAt!).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Última actualización">
            {new Date(candidate.updatedAt!).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Historial de Cambios" style={{ marginTop: 16 }}>
        {renderHistoryTimeline()}
      </Card>
    </div>
  );
};

export default CandidateDetail; 