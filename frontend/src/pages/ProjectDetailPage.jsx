import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProject, joinProject } from '../services/projectService.js';
import { fetchChat, postChatMessage } from '../services/chatService.js';
import { useAuth } from '../hooks/useAuth.js';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [matchScore, setMatchScore] = useState(null);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProject = async () => {
    try {
      setIsLoading(true);
      const data = await fetchProject(id, token);
      setProject(data.project);
      setMatchScore(data.matchScore);
    } catch (_error) {
      setError('Failed to load project.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadChat = async () => {
    if (!isAuthenticated) return;
    try {
      const data = await fetchChat(id, token);
      setChat(data);
    } catch (_error) {
      // ignore chat errors for now
    }
  };

  useEffect(() => {
    loadProject();
    loadChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const formatDate = (value) => {
    if (!value) return 'TBD';
    return new Date(value).toLocaleDateString();
  };

  const handleJoin = async () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    try {
      setIsJoining(true);
      const data = await joinProject(id, token);
      setProject(data.project);
      setMatchScore(data.matchScore);
    } catch (_error) {
      setError('Unable to join project.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const data = await postChatMessage(id, message, token);
      setChat((prev) => [...prev, data]);
      setMessage('');
    } catch (_error) {
      // ignore send errors for now
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!project) {
    return <p>Project not found.</p>;
  }

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{project.title}</h1>
        <p className="text-gray-700">{project.description}</p>
        <div className="text-sm text-gray-500">
          {project.location?.city} · {project.difficulty} · Status: {project.status}
        </div>
        <div className="flex gap-3">
          <button onClick={handleJoin} className="px-4 py-2 border rounded" disabled={isJoining}>
            {isJoining ? 'Joining...' : 'Take This On'}
          </button>
          {matchScore !== null && (
            <p className="text-sm text-gray-600">
              You match {matchScore}% of the tool requirements — you are a strong fit!
            </p>
          )}
        </div>
      </header>

      <section className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Details</h2>
        <p><strong>Tools required:</strong> {project.toolsRequired?.join(', ') || 'Not specified'}</p>
        <p>
          <strong>Timeline:</strong>{' '}
          {project.timeline?.startDate
            ? `${formatDate(project.timeline.startDate)} - ${formatDate(project.timeline?.endDate)}`
            : 'TBD'}
        </p>
        <p><strong>Volunteers:</strong> {project.volunteers?.map((v) => v.name).join(', ') || 'No volunteers yet'}</p>
      </section>

      {isAuthenticated && (
        <section className="bg-white rounded-lg p-4 shadow-sm flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Team Chat</h2>
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto border rounded p-3 bg-gray-50">
            {chat.map((entry) => (
              <div key={entry._id} className="text-sm">
                <strong>{entry.userId?.name || 'Volunteer'}:</strong> {entry.message}
              </div>
            ))}
            {!chat.length && <p className="text-sm text-gray-500">No messages yet.</p>}
          </div>
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share an update..."
              className="flex-1 border rounded px-3 py-2"
            />
            <button type="submit" className="px-4 py-2 border rounded">
              Send
            </button>
          </form>
        </section>
      )}
    </section>
  );
};

export default ProjectDetailPage;

