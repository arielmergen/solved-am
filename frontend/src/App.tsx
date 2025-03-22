import React, { useState } from 'react';
import { Layout, Menu, Button, Typography, message } from 'antd';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import { Routes, Route, useNavigate } from 'react-router-dom';
import CandidateList from './components/candidates/CandidateList';
import { Candidate } from './types/candidate.types';
import CandidateForm from './components/candidates/CandidateForm';
import CandidateDetail from './components/candidates/CandidateDetail';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

enum AppView {
  LIST = 'list',
  CREATE = 'create',
  EDIT = 'edit',
  DETAIL = 'detail'
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LIST);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const navigate = useNavigate();

  const handleEditCandidate = (candidate: Candidate) => {
    console.log('Editar candidato:', candidate);
  };

  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setCurrentView(AppView.DETAIL);
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.CREATE:
        return (
          <>
            <Title level={3}>Nuevo Candidato</Title>
            <CandidateForm onSuccess={() => {
              setCurrentView(AppView.LIST);
              message.success('Candidato creado exitosamente');
            }} />
          </>
        );
      case AppView.DETAIL:
        return selectedCandidate ? (
          <CandidateDetail 
            candidateId={selectedCandidate.id!}
            onEdit={(id) => {
              setCurrentView(AppView.EDIT);
            }}
            onBack={() => setCurrentView(AppView.LIST)}
          />
        ) : null;
      case AppView.LIST:
      default:
        return (
          <>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={3}>Candidatos</Title>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setCurrentView(AppView.CREATE)}>
                Nuevo Candidato
              </Button>
            </div>
            <CandidateList 
              onEdit={handleEditCandidate} 
              onView={handleViewCandidate}
            />
          </>
        );
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<UserOutlined />}>
            Gestión de Candidatos
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px', marginTop: 16 }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <Routes>
            <Route path="/" element={renderContent()} />
            <Route path="/home" element={renderContent()} />
          </Routes>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Sistema de Gestión de Candidatos ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default App; 