import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { createViewerToken } from '@/actions/token';
import jwt from 'jsonwebtoken';

export const useViewerToken = (hostIdentity: string) => {
  const [token, setToken] = useState('');
  const [name, setName] = useState<string | undefined>();
  const [identity, setIdentity] = useState('');

  useEffect(() => {
    const createToken = async () => {
      try {
        const viewerToken = await createViewerToken(hostIdentity);
        setToken(viewerToken);

        const decodedToken = jwt.decode(viewerToken) as jwt.JwtPayload & {
          name?: string;
          identity?: string;
        };

        const name = decodedToken.name;
        const identity = decodedToken.identity;

        if (identity) {
          setIdentity(identity);
        }

        if (name) {
          setName(name);
        }
      } catch (error) {
        toast.error('Something went wrong');
      }
    };

    createToken();
  }, [hostIdentity]);

  return {
    token,
    name,
    identity,
  };
};
