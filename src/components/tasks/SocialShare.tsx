
import { Button } from "@/components/ui/button";
import { Twitter, Instagram, Facebook, Youtube } from "lucide-react";
import { toast } from "sonner";

const SocialShare = () => {
  const shareSocial = (platform: string) => {
    toast.success(`Opening ${platform} share dialog...`);
  };

  return (
    <div className="mt-6 p-4 bg-sphere-card-dark rounded-md">
      <h3 className="text-lg font-medium mb-4">Share on Social Media</h3>
      <div className="flex flex-wrap gap-3">
        <Button 
          variant="outline" 
          className="bg-[#1DA1F2] bg-opacity-10 border-[#1DA1F2] hover:bg-[#1DA1F2] hover:bg-opacity-20"
          onClick={() => shareSocial('Twitter')}
        >
          <Twitter className="mr-2 h-4 w-4" />
          Twitter
        </Button>
        <Button 
          variant="outline" 
          className="bg-[#E4405F] bg-opacity-10 border-[#E4405F] hover:bg-[#E4405F] hover:bg-opacity-20"
          onClick={() => shareSocial('Instagram')}
        >
          <Instagram className="mr-2 h-4 w-4" />
          Instagram
        </Button>
        <Button 
          variant="outline" 
          className="bg-[#1877F2] bg-opacity-10 border-[#1877F2] hover:bg-[#1877F2] hover:bg-opacity-20"
          onClick={() => shareSocial('Facebook')}
        >
          <Facebook className="mr-2 h-4 w-4" />
          Facebook
        </Button>
        <Button 
          variant="outline" 
          className="bg-[#FF0000] bg-opacity-10 border-[#FF0000] hover:bg-[#FF0000] hover:bg-opacity-20"
          onClick={() => shareSocial('YouTube')}
        >
          <Youtube className="mr-2 h-4 w-4" />
          YouTube
        </Button>
      </div>
    </div>
  );
};

export default SocialShare;
