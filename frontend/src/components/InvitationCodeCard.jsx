import React, { Component } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Copy } from 'lucide-react';

class InvitationCodeCard extends Component {
  render() {
    const { invitationCode, copied, onCopy, isDarkMode } = this.props;
    return (
      <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
        <CardContent className="p-4 flex items-center justify-between">
          <p className={`font-mono ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
            Invitation Code: <strong>{invitationCode}</strong>
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopy}
            className={isDarkMode ? 'hover:bg-gray-600' : ''}
          >
            {copied ? (
              <span className={isDarkMode ? 'text-green-400' : 'text-green-600'}>Copied!</span>
            ) : (
              <Copy size={16} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }
}

export default InvitationCodeCard;
