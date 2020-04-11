import React, {useState, useEffect} from "react";

import api from './services/api';

import "./styles.css";

function App() {

  const [repositories, setRepositories] = useState([]);
  const [techs, setTechs] = useState('');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    api.get('/repositories').then(response => {
      setRepositories(response.data);
    });
  }, []);

  function clearForm() {
    setTechs('');
    setUrl('');
    setTitle('');
  }

  /**
   * The test of this application doesn't support this behavior
   */
  function isValidForm() {
    return title && techs && url;
  }

  function removeRepositoryById(id) {
    const repositoryIndex = repositories.findIndex(repo => repo.id === id);
    repositories.splice(repositoryIndex, 1);
    setRepositories([...repositories]);
  }


  async function handleAddRepository() {
    const newRepository = {
      title,
      techs,
      url
    };
    const response = await api.post('/repositories', newRepository);
    if (response.status === 201){
      setRepositories([...repositories, response.data]);
      clearForm();
    }
  }

  async function handleRemoveRepository(id) {
    const response = await api.delete(`/repositories/${id}`);
    if (response.status === 204) {
      removeRepositoryById(id);
      return;
    }
    alert('Error trying delete repository!');
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {
          repositories.map(repository => (
            <li key={repository.id}>
              <label htmlFor="repository-title">Repository title:</label>
              <span id="repository-title">{repository.title}</span>
              <button className="float-right" onClick={() => handleRemoveRepository(repository.id)}>
                Remover
              </button>
            </li> 
          ))
        }

      </ul>

      <div className="add-repository-form-content">
        <form>
          <label htmlFor="repository-title">Title</label>
          <input 
            type="text" 
            value={title}
            name="title" 
            id="repository-title"
            onChange={(e) => setTitle(e.target.value)}
          />

          <label htmlFor="repository-url">Url</label>
          <input 
            type="text"
            value={url}
            name="url" 
            id="repository-url"
            onChange={(e) => setUrl(e.target.value)}
          />

          <label htmlFor="repository-techs">Techs</label>
          <input 
            type="text"
            value={techs}
            name="techs" 
            id="repository-techs"
            onChange={(e) => setTechs(e.target.value)}
          />
        </form>
        
        <button onClick={() => handleAddRepository()}>Adicionar</button>
      </div>

    </div>
  );
}

export default App;
