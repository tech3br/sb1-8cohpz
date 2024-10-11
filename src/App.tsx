import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Upload, Link, Image } from 'lucide-react';

const { ipcRenderer } = window.require('electron');

function App() {
  const [localPath, setLocalPath] = useState('');
  const [url, setUrl] = useState('');
  const { toast } = useToast();

  const handleSetWallpaper = async (path: string) => {
    try {
      const result = await ipcRenderer.invoke('set-wallpaper', path);
      if (result.success) {
        toast({
          title: "Wallpaper set successfully!",
          description: "Your new wallpaper has been applied.",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem setting your wallpaper.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Windows Wallpaper Changer</h1>
      <Tabs defaultValue="local" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="local">Local File</TabsTrigger>
          <TabsTrigger value="url">URL</TabsTrigger>
          <TabsTrigger value="premium" disabled>Premium Gallery</TabsTrigger>
        </TabsList>
        <TabsContent value="local">
          <Card>
            <CardHeader>
              <CardTitle>Choose Local File</CardTitle>
              <CardDescription>Select an image file from your computer to set as wallpaper.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="local-path">Image Path</Label>
                <div className="flex space-x-2">
                  <Input id="local-path" value={localPath} onChange={(e) => setLocalPath(e.target.value)} />
                  <Button variant="secondary">
                    <Upload className="mr-2 h-4 w-4" />
                    Browse
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSetWallpaper(localPath)}>Set Wallpaper</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="url">
          <Card>
            <CardHeader>
              <CardTitle>Set from URL</CardTitle>
              <CardDescription>Enter the URL of an image to set as wallpaper.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="url">Image URL</Label>
                <Input id="url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSetWallpaper(url)}>Set Wallpaper</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="premium">
          <Card>
            <CardHeader>
              <CardTitle>Premium Wallpaper Gallery</CardTitle>
              <CardDescription>Browse and select from our curated collection of premium wallpapers.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40 bg-muted rounded-md">
                <Image className="h-10 w-10 text-muted-foreground" />
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled>Coming Soon</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;