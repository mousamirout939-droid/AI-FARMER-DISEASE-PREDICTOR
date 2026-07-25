import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, MessageCircle } from 'lucide-react';
import { communityApi } from '../api/endpoints.js';
import { useAuth } from '../hooks/useAuth.js';

export default function Community() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['community'], queryFn: () => communityApi.list() });
  const posts = data?.data?.data || [];

  const createMutation = useMutation({
    mutationFn: communityApi.create,
    onSuccess: () => {
      setContent('');
      setTitle('');
      queryClient.invalidateQueries({ queryKey: ['community'] });
    },
  });

  const likeMutation = useMutation({
    mutationFn: communityApi.like,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['community'] }),
  });

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-forest dark:text-sage-50">Farmer Community</h1>

      {user && (
        <div className="card mt-6">
          <input
            className="input mb-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="input"
            rows={3}
            placeholder="Share something with fellow farmers…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            className="btn-primary mt-3 text-sm"
            disabled={!title || !content || createMutation.isPending}
            onClick={() => createMutation.mutate({ title, content })}
          >
            Post
          </button>
        </div>
      )}

      {isLoading && <p className="mt-6 text-sm text-forest/50">Loading…</p>}

      <div className="mt-6 space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="card">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-wheat/30 text-sm font-semibold text-forest">
                {post.author?.name?.[0]?.toUpperCase() || 'U'}
              </span>
              <div>
                <div className="text-sm font-medium text-forest dark:text-sage-50">{post.author?.name}</div>
                <div className="text-xs text-forest/50 dark:text-sage-100/50">{new Date(post.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
            <h3 className="mt-3 font-semibold text-forest dark:text-sage-50">{post.title}</h3>
            <p className="mt-1 text-sm text-forest/70 dark:text-sage-100/70">{post.content}</p>
            <div className="mt-3 flex items-center gap-4 text-sm text-forest/50 dark:text-sage-100/50">
              <button className="flex items-center gap-1 hover:text-clay" onClick={() => likeMutation.mutate(post._id)}>
                <Heart className="h-4 w-4" /> {post.likes?.length || 0}
              </button>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" /> {post.comments?.length || 0}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
