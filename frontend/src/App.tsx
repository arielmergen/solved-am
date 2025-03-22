import React, { useState } from 'react';
import { Layout, Menu, Button, Typography, message } from 'antd';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import CandidateList from './components/candidates/CandidateList';
import CandidateForm from './components/candidates/CandidateForm';
import CandidateDetail from './components/candidates/CandidateDetail';
import { Candidate } from './types/candidate.types';
import './App.css';
import { useNavigate } from 'react-router-dom';

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

  const handleCreateClick = () => {
    setSelectedCandidate(null);
    setCurrentView(AppView.CREATE);
  };

  const handleEditCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setCurrentView(AppView.EDIT);
  };

  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setCurrentView(AppView.DETAIL);
  };

  const handleFormSuccess = () => {
    setCurrentView(AppView.LIST);
    message.success('Operación completada con éxito');
  };

  const handleMenuClick = (key: string) => {
    if (key === "1") {
      navigate('/home');
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.CREATE:
        return (
          <CandidateForm 
            onSuccess={handleFormSuccess}
          />
        );
      case AppView.EDIT:
        return (
          <CandidateForm 
            initialData={selectedCandidate!}
            onSuccess={handleFormSuccess}
          />
        );
      case AppView.DETAIL:
        return (
          <CandidateDetail 
            candidateId={selectedCandidate!.id!}
            onEdit={handleEditCandidate}
            onBack={() => setCurrentView(AppView.LIST)}
          />
        );
      case AppView.LIST:
      default:
        return (
          <>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={3}>Candidatos</Title>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleCreateClick}
              >
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
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} onClick={(e) => handleMenuClick(e.key)}>
          <Menu.Item key="1" icon={<UserOutlined />}>
            Gestión de Candidatos
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px', marginTop: 16 }}>
        <div className="site-layout-content" style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          {renderContent()}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Sistema de Gestión de Candidatos ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default App;
