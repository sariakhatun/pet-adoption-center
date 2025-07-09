import { Button } from '@/components/ui/button';
import React from 'react';
import { FaGithub } from 'react-icons/fa';

const GithubLogin = () => {
    return (
        <div>
            <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <FaGithub className="text-black" />
          Continue with GitHub
        </Button>
        </div>
    );
};

export default GithubLogin;