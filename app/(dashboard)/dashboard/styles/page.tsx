"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { AlertCircle, Check, ChevronsUpDown, Plus } from "lucide-react"

export default function StylesPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  const colors = [
    { name: 'Primary', var: 'bg-primary', value: 'var(--color-primary)', className: 'bg-primary' },
    { name: 'Primary (90%)', var: 'bg-primary/90', value: 'var(--color-primary) + 90% opacity', className: 'bg-primary/90' },
    { name: 'Primary (50%)', var: 'bg-primary/50', value: 'var(--color-primary) + 50% opacity', className: 'bg-primary/50' },
    { name: 'Background', var: 'bg-background', value: 'var(--color-background)', className: 'bg-background border' },
    { name: 'Foreground', var: 'bg-foreground', value: 'var(--color-foreground)', className: 'bg-foreground' },
    { name: 'Secondary', var: 'bg-secondary', value: 'var(--color-secondary)', className: 'bg-secondary' },
    { name: 'Muted', var: 'bg-muted', value: 'var(--color-muted)', className: 'bg-muted' },
    { name: 'Accent', var: 'bg-accent', value: 'var(--color-accent)', className: 'bg-accent' },
    { name: 'Destructive', var: 'bg-destructive', value: 'var(--color-destructive)', className: 'bg-destructive' },
  ]

  const colorCombos = [
    { bg: 'bg-primary', text: 'text-primary-foreground', name: 'Primary + Foreground' },
    { bg: 'bg-secondary', text: 'text-secondary-foreground', name: 'Secondary + Foreground' },
    { bg: 'bg-accent', text: 'text-accent-foreground', name: 'Accent + Foreground' },
    { bg: 'bg-muted', text: 'text-muted-foreground', name: 'Muted + Foreground' },
    { bg: 'bg-destructive', text: 'text-destructive-foreground', name: 'Destructive + Foreground' },
  ]

  const spacingExamples = [
    { name: 'xs', class: 'p-2', size: '0.5rem' },
    { name: 'sm', class: 'p-4', size: '1rem' },
    { name: 'md', class: 'p-6', size: '1.5rem' },
    { name: 'lg', class: 'p-8', size: '2rem' },
    { name: 'xl', class: 'p-12', size: '3rem' },
  ]

  return (
    <div className="flex-1 space-y-6 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Style Guide</h2>
      </div>
      
      <Tabs defaultValue="components" className="space-y-4">
        <TabsList>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="space-y-4">
          {/* Basic Input Components */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Input Components</CardTitle>
              <CardDescription>Essential form and input components for user interaction</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="m@example.com" type="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" placeholder="Tell us about yourself..." />
                </div>
                <div className="flex items-center space-x-4">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">Accept terms and conditions</Label>
                </div>
                <div className="flex items-center space-x-4">
                  <Switch id="notifications" />
                  <Label htmlFor="notifications">Enable notifications</Label>
                </div>
                <div className="space-y-2">
                  <Label>Select Theme</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Components */}
          <Card>
            <CardHeader>
              <CardTitle>Interactive Components</CardTitle>
              <CardDescription>Buttons, dialogs, and other interactive elements</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex flex-wrap gap-4">
                <Button>Default Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>

              <div className="flex items-center gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Open Dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Example Dialog</DialogTitle>
                      <DialogDescription>
                        This is how our dialog component looks. It's great for confirmations and forms.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">Dialog content goes here</div>
                  </DialogContent>
                </Dialog>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add new item</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>

          {/* Navigation and Layout */}
          <Card>
            <CardHeader>
              <CardTitle>Navigation and Layout</CardTitle>
              <CardDescription>Components for navigation and layout structure</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
                        <div className="p-4">
                          <h4 className="text-sm font-medium leading-none">Introduction</h4>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Learn the basics and get started quickly.
                          </p>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
                        <div className="p-4">
                          <h4 className="text-sm font-medium leading-none">UI Components</h4>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Beautifully designed components built with Radix UI and Tailwind CSS.
                          </p>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </CardContent>
          </Card>

          {/* Data Display */}
          <Card>
            <CardHeader>
              <CardTitle>Data Display</CardTitle>
              <CardDescription>Components for displaying data and content</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Info Alert</AlertTitle>
                  <AlertDescription>
                    This is how our alert component looks.
                  </AlertDescription>
                </Alert>

                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Badge>New</Badge>
                  <Badge variant="secondary">Updated</Badge>
                  <Badge variant="outline">Version 2.0</Badge>
                </div>

                <div className="space-y-2">
                  <Label>Volume</Label>
                  <Slider
                    defaultValue={[50]}
                    max={100}
                    step={1}
                  />
                </div>

                <div className="rounded-lg border p-4">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Colors</CardTitle>
              <CardDescription>Base colors used throughout the application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {colors.map((color) => (
                  <div key={color.name} className="space-y-3">
                    <div className={`${color.className} h-24 w-full rounded-md border shadow-sm`} />
                    <div>
                      <div className="font-medium">{color.name}</div>
                      <div className="text-sm text-muted-foreground">{color.var}</div>
                      <div className="text-xs font-mono text-muted-foreground">{color.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Typography Scale</CardTitle>
              <CardDescription>Text sizes and styles used in the application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    The quick brown fox jumps over the lazy dog
                  </h1>
                  <p className="text-sm text-muted-foreground">text-4xl/text-5xl font-extrabold</p>
                </div>
                <div>
                  <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
                    The quick brown fox jumps over the lazy dog
                  </h2>
                  <p className="text-sm text-muted-foreground">text-3xl font-semibold</p>
                </div>
                <div>
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    The quick brown fox jumps over the lazy dog
                  </h3>
                  <p className="text-sm text-muted-foreground">text-2xl font-semibold</p>
                </div>
                <div>
                  <p className="leading-7 [&:not(:first-child)]:mt-6">
                    The quick brown fox jumps over the lazy dog
                  </p>
                  <p className="text-sm text-muted-foreground">text-base leading-7</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    The quick brown fox jumps over the lazy dog
                  </p>
                  <p className="text-sm text-muted-foreground">text-sm text-muted-foreground</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 