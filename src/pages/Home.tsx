// Enhanced TypeScript component for event/ticket display
import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';

// Type definitions
interface Project {
  id: string;
  title: string;
  description: string;
  technologies?: string[];
  liveUrl?: string;
  githubUrl?: string;
}

interface ProjectsData {
  projects: Project[];
}

const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      title
      description
    }
  }
`;

// Custom hook for better separation of concerns
const useProjects = () => {
  const { data, loading, error } = useQuery<ProjectsData>(GET_PROJECTS);
  return { projects: data?.projects || [], loading, error };
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article 
      className="project-card"
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        margin: '16px 0',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer'
      }}
      onClick={() => setIsExpanded(!isExpanded)}
      onKeyPress={(e) => e.key === 'Enter' && setIsExpanded(!isExpanded)}
      tabIndex={0}
      role="button"
      aria-expanded={isExpanded}
    >
      <h3 style={{ margin: '0 0 12px 0', color: '#2c3e50' }}>
        {project.title}
      </h3>
      <p style={{ color: '#555', lineHeight: '1.6' }}>
        {project.description}
      </p>
      
      {isExpanded && (
        <div 
          className="project-details" 
          style={{ 
            marginTop: '16px', 
            padding: '12px', 
            background: '#f8f9fa', 
            borderRadius: '4px' 
          }}
        >
          <p><strong>ID:</strong> {project.id}</p>
          <p><em>Click to toggle details</em></p>
        </div>
      )}
    </article>
  );
};

const ErrorBoundary: React.FC<{ error: Error }> = ({ error }) => (
  <div 
    role="alert" 
    style={{ 
      padding: '20px', 
      background: '#fee', 
      border: '1px solid #fcc', 
      borderRadius: '4px',
      color: '#c00'
    }}
  >
    <h3>⚠️ Something went wrong</h3>
    <p>{error.message}</p>
    <button 
      onClick={() => window.location.reload()}
      style={{
        padding: '8px 16px',
        background: '#c00',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '12px'
      }}
    >
      Retry
    </button>
  </div>
);

const LoadingSpinner: React.FC = () => (
  <div style={{ textAlign: 'center', padding: '40px' }}>
    <div 
      style={{
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
        margin: '0 auto'
      }}
    />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
    <p style={{ marginTop: '16px', color: '#666' }}>Loading projects...</p>
  </div>
);

const Home: React.FC = () => {
  const { projects, loading, error } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter projects based on search
  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorBoundary error={error} />;

  return (
    <section style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem', color: '#2c3e50', marginBottom: '8px' }}>
          My Projects
        </h2>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          Showcasing my work with modern web technologies
        </p>
      </header>

      {/* Search functionality */}
      <div style={{ marginBottom: '24px' }}>
        <input
          type="search"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '8px',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3498db'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
          aria-label="Search projects"
        />
      </div>

      {/* Results count */}
      <div style={{ marginBottom: '16px', color: '#666' }}>
        {searchTerm && (
          <p>
            Found {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Projects list */}
      {filteredProjects.length > 0 ? (
        <div role="list">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          <p>No projects found matching "{searchTerm}"</p>
        </div>
      )}
    </section>
  );
};

export default Home;
