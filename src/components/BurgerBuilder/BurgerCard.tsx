"use client";

import type { Burger } from '@/lib/types';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Wheat, Carrot } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import PattyIcon from './PattyIcon';
import BurgerIcon from './BurgerIcon';
import { getPrepItems, type PrepIcon } from '@/lib/burger-prep';

interface BurgerCardProps {
  burger: Burger;
  prepared: string[];
  onTogglePrepared: (burgerId: string, itemKey: string) => void;
  onRemove: (burgerId: string) => void;
}

const PrepLineIcon: React.FC<{ icon: PrepIcon; className?: string }> = ({ icon, className }) => {
  if (icon === 'bun') return <Wheat className={className} />;
  if (icon === 'patty') return <PattyIcon className={className} />;
  return <Carrot className={className} />;
};

const BurgerCard: React.FC<BurgerCardProps> = ({ burger, prepared, onTogglePrepared, onRemove }) => {
  const items = getPrepItems(burger);
  const checked = new Set(prepared);
  const doneCount = items.filter((i) => checked.has(i.key)).length;
  const complete = items.length > 0 && doneCount === items.length;
  const progress = items.length > 0 ? (doneCount / items.length) * 100 : 0;

  return (
    <Card
      className={cn(
        'shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full',
        complete && 'border-primary ring-1 ring-primary'
      )}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <BurgerIcon className="h-6 w-6 shrink-0 text-primary" />
          <span className="truncate flex-grow">{burger.personName}&rsquo;s Burger</span>
          {complete && (
            <Badge variant="default" className="shrink-0">
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Ready
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        {/* Prep progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Prep checklist</span>
            <span className="text-muted-foreground tabular-nums">
              {doneCount}/{items.length} prepared
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Checklist */}
        <div className="space-y-1">
          {items.map((item) => {
            const isChecked = checked.has(item.key);
            const inputId = `${burger.id}-${item.key}`;
            return (
              <label
                key={item.key}
                htmlFor={inputId}
                className="flex items-center gap-3 rounded-md -mx-2 px-2 py-2 cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={inputId}
                  checked={isChecked}
                  onCheckedChange={() => onTogglePrepared(burger.id, item.key)}
                  className="h-5 w-5"
                />
                <PrepLineIcon icon={item.icon} className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span
                  className={cn(
                    'text-sm flex-grow',
                    isChecked && 'line-through text-muted-foreground'
                  )}
                >
                  {item.label}
                </span>
                {item.quantity > 1 && (
                  <Badge variant="outline" className="shrink-0">
                    x{item.quantity}
                  </Badge>
                )}
              </label>
            );
          })}
        </div>
      </CardContent>
      <div className="p-4 pt-0">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant={complete ? 'default' : 'outline'}
              className="w-full h-11"
              disabled={!complete}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Delivered
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Mark {burger.personName}&rsquo;s burger delivered?</AlertDialogTitle>
              <AlertDialogDescription>
                This removes the order from the list. You can&rsquo;t undo this.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onRemove(burger.id)}>
                Mark Delivered
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {!complete && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Tick every ingredient to mark this burger delivered.
          </p>
        )}
      </div>
    </Card>
  );
};

export default BurgerCard;
