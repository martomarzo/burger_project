"use client";

import type { Ingredient, Burger } from '@/lib/types';
import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle, ArrowLeft, PackageCheck, Plus, Minus, Wheat, Carrot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import PattyIcon from './PattyIcon';
import BurgerIcon from './BurgerIcon';
import BurgerPreview, { type PreviewTopping } from './BurgerPreview';
import { getConsumedCounts, remainingFor, isUnlimited } from '@/lib/inventory';

interface BurgerCreatorProps {
  availableIngredients: Ingredient[];
  burgers: Burger[];
  addBurger: (burger: Burger) => void;
  onGoBack: () => void;
  onOrderReady: () => void;
}

const BurgerCreator: React.FC<BurgerCreatorProps> = ({ availableIngredients, burgers, addBurger, onGoBack, onOrderReady }) => {
  const [personName, setPersonName] = useState('');
  const [selectedBunId, setSelectedBunId] = useState<string | null>(null);
  const [selectedPattyId, setSelectedPattyId] = useState<string | null>(null);
  const [pattyQuantity, setPattyQuantity] = useState(1);
  const [toppingQuantities, setToppingQuantities] = useState<Record<string, number>>({});
  const { toast } = useToast();

  // Units already used by burgers in the order; drives what's still in stock.
  const consumed = useMemo(() => getConsumedCounts(burgers), [burgers]);
  const remainingOf = (ingredient: Ingredient) => remainingFor(ingredient, consumed);

  // Only ingredients with stock left are offered; depleted ones disappear.
  const { buns, patties, toppings } = useMemo(() => {
    const grouped = availableIngredients.reduce((acc, ingredient) => {
      (acc[ingredient.category] = acc[ingredient.category] || []).push(ingredient);
      return acc;
    }, {} as Record<Ingredient['category'], Ingredient[]>);
    const inStock = (i: Ingredient) => remainingFor(i, consumed) >= 1;
    return {
      buns: (grouped.bun || []).filter(inStock),
      patties: (grouped.patty || []).filter(inStock),
      toppings: (grouped.topping || []).filter(inStock),
    };
  }, [availableIngredients, consumed]);

  // Resolved selections drive the live preview.
  const selectedBun = buns.find(b => b.id === selectedBunId) || null;
  const selectedPatty = patties.find(p => p.id === selectedPattyId) || null;
  const previewToppings = useMemo<PreviewTopping[]>(
    () =>
      Object.entries(toppingQuantities)
        .map(([id, quantity]) => {
          const t = toppings.find(tp => tp.id === id);
          return t ? { id, name: t.name, quantity } : null;
        })
        .filter(Boolean) as PreviewTopping[],
    [toppingQuantities, toppings]
  );

  const resetForm = () => {
    setPersonName('');
    setSelectedBunId(null);
    setSelectedPattyId(null);
    setPattyQuantity(1);
    setToppingQuantities({});
  };

  const handlePattySelection = (pattyId: string) => {
    setSelectedPattyId(pattyId);
    setPattyQuantity(1); // Reset quantity to 1 when a new patty is selected
  };

  const handlePattyQuantityChange = (change: 1 | -1) => {
    const max = selectedPatty ? remainingOf(selectedPatty) : 1;
    setPattyQuantity(prev => Math.min(max, Math.max(1, prev + change)));
  };

  const handleToppingQuantityChange = (toppingId: string, change: 1 | -1) => {
    const topping = toppings.find(t => t.id === toppingId);
    const max = topping ? remainingOf(topping) : 0;
    setToppingQuantities(prev => {
      const currentQuantity = prev[toppingId] || 0;
      const newQuantity = Math.min(max, Math.max(0, currentQuantity + change));
      const newQuantities = { ...prev };
      if (newQuantity === 0) {
        delete newQuantities[toppingId];
      } else {
        newQuantities[toppingId] = newQuantity;
      }
      return newQuantities;
    });
  };

  const handleCreateAndAddAnotherBurger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName.trim()) {
      toast({ title: 'Missing Name', description: "Please enter a name for the person this burger is for.", variant: 'destructive'});
      return;
    }
    const bun = buns.find(b => b.id === selectedBunId);
    if (!bun) {
      toast({ title: 'Missing Bun', description: 'Please select a bun for the burger.', variant: 'destructive'});
      return;
    }
    const pattyInfo = patties.find(p => p.id === selectedPattyId);
    if (!pattyInfo) {
      toast({ title: 'Missing Patty', description: 'Please select a patty and quantity.', variant: 'destructive'});
      return;
    }

    // Re-check stock at commit time (the order may have changed in another tab).
    if (remainingOf(bun) < 1) {
      toast({ title: 'Out of Stock', description: `There are no more "${bun.name}" buns left.`, variant: 'destructive' });
      return;
    }
    if (pattyQuantity > remainingOf(pattyInfo)) {
      toast({ title: 'Not Enough Stock', description: `Only ${remainingOf(pattyInfo)} "${pattyInfo.name}" left.`, variant: 'destructive' });
      return;
    }
    const overTopping = Object.entries(toppingQuantities).find(([id, qty]) => {
      const t = toppings.find(tp => tp.id === id);
      return t && qty > remainingOf(t);
    });
    if (overTopping) {
      const t = toppings.find(tp => tp.id === overTopping[0])!;
      toast({ title: 'Not Enough Stock', description: `Only ${remainingOf(t)} "${t.name}" left.`, variant: 'destructive' });
      return;
    }

    const newBurger: Burger = {
      id: Date.now().toString(),
      personName: personName.trim(),
      bun,
      patty: { ...pattyInfo, quantity: pattyQuantity },
      toppings: Object.entries(toppingQuantities)
        .map(([id, quantity]) => {
          const toppingInfo = toppings.find(t => t.id === id)!;
          return { ...toppingInfo, quantity };
        }),
    };

    addBurger(newBurger);
    toast({ title: 'Burger Added!', description: `Burger for ${newBurger.personName} added to the order.` });
    resetForm();
  };

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-6 lg:items-start">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl"><BurgerIcon className="h-6 w-6 text-primary" />Create a Burger</CardTitle>
          <CardDescription>Assemble a burger by choosing a bun, patty, and toppings.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateAndAddAnotherBurger} className="space-y-6">
            <div>
              <Label htmlFor="personName" className="flex items-center gap-2 mb-2 font-medium"><UserCircle className="h-5 w-5 text-muted-foreground" />Burger For (Name):</Label>
              <Input id="personName" type="text" value={personName} onChange={(e) => setPersonName(e.target.value)} placeholder="e.g., Jane Doe" className="h-11" />
            </div>

            {/* Live preview — shown inline on mobile, in the sidebar on desktop */}
            <BurgerPreview
              className="lg:hidden"
              personName={personName}
              bunName={selectedBun?.name}
              pattyName={selectedPatty?.name}
              pattyQuantity={pattyQuantity}
              toppings={previewToppings}
            />

            <div className="space-y-6">
              {/* Buns Section */}
              <div>
                <Label className="flex items-center gap-2 mb-2 font-medium"><Wheat className="h-5 w-5 text-muted-foreground" />Choose a Bun</Label>
                <RadioGroup value={selectedBunId ?? ''} onValueChange={setSelectedBunId} className="grid grid-cols-2 gap-2">
                  {buns.map(bun => (
                    <Label key={bun.id} htmlFor={bun.id} className="flex min-h-[44px] items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50 has-[input:checked]:bg-accent has-[input:checked]:text-accent-foreground has-[input:checked]:border-ring">
                      <RadioGroupItem value={bun.id} id={bun.id} />
                      <span>{bun.name}</span>
                      {!isUnlimited(bun) && <span className="ml-auto text-xs text-muted-foreground">{remainingOf(bun)} left</span>}
                    </Label>
                  ))}
                </RadioGroup>
                {buns.length === 0 && (
                  <p className="text-sm text-muted-foreground py-2">All buns are used up. Add more stock in the previous step.</p>
                )}
              </div>

              {/* Patties Section */}
              <div>
                <Label className="flex items-center gap-2 mb-2 font-medium"><PattyIcon className="h-5 w-5 text-muted-foreground" />Choose a Patty</Label>
                <div className="grid grid-cols-2 gap-2">
                  <RadioGroup value={selectedPattyId ?? ''} onValueChange={handlePattySelection} className="contents">
                    {patties.map(patty => (
                      <Label key={patty.id} htmlFor={patty.id} className="flex min-h-[44px] items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50 has-[input:checked]:bg-accent has-[input:checked]:text-accent-foreground has-[input:checked]:border-ring">
                        <RadioGroupItem value={patty.id} id={patty.id} />
                        <span>{patty.name}</span>
                        {!isUnlimited(patty) && <span className="ml-auto text-xs text-muted-foreground">{remainingOf(patty)} left</span>}
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
                {patties.length === 0 && (
                  <p className="text-sm text-muted-foreground py-2">All patties are used up. Add more stock in the previous step.</p>
                )}
                {selectedPattyId && selectedPatty && (
                  <div className="flex items-center gap-3 mt-3 justify-center p-2 border rounded-md max-w-xs mx-auto">
                    <span className="font-medium">Quantity:</span>
                    <Button type="button" variant="outline" size="icon" className="h-11 w-11" onClick={() => handlePattyQuantityChange(-1)} aria-label="Decrease patty quantity"><Minus className="h-4 w-4" /></Button>
                    <span className="w-10 text-center font-medium text-lg" aria-live="polite">{pattyQuantity}</span>
                    <Button type="button" variant="outline" size="icon" className="h-11 w-11" disabled={pattyQuantity >= remainingOf(selectedPatty)} onClick={() => handlePattyQuantityChange(1)} aria-label="Increase patty quantity"><Plus className="h-4 w-4" /></Button>
                  </div>
                )}
              </div>

              {/* Toppings Section */}
              <div>
                <Label className="flex items-center gap-2 mb-2 font-medium"><Carrot className="h-5 w-5 text-muted-foreground" />Add Toppings</Label>
                <div className="space-y-2 rounded-md border p-3 shadow-inner bg-background/50">
                  {toppings.length === 0 && (
                    <p className="text-sm text-muted-foreground py-2 text-center">No toppings available. Add some in the previous step.</p>
                  )}
                  {toppings.map((topping) => (
                    <div key={topping.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/30">
                      <Label htmlFor={`topping-qty-${topping.id}`} className="font-normal">
                        {topping.name}
                        {!isUnlimited(topping) && <span className="ml-2 text-xs text-muted-foreground">({remainingOf(topping)} left)</span>}
                      </Label>
                      <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" size="icon" className="h-11 w-11" onClick={() => handleToppingQuantityChange(topping.id, -1)} aria-label={`Less ${topping.name}`}><Minus className="h-4 w-4" /></Button>
                        <span id={`topping-qty-${topping.id}`} className="w-10 text-center font-medium text-lg" aria-live="polite">{toppingQuantities[topping.id] || 0}</span>
                        <Button type="button" variant="outline" size="icon" className="h-11 w-11" disabled={(toppingQuantities[topping.id] || 0) >= remainingOf(topping)} onClick={() => handleToppingQuantityChange(topping.id, 1)} aria-label={`More ${topping.name}`}><Plus className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full text-base h-12">
              <BurgerIcon className="mr-2 h-5 w-5" /> Add This Burger to Order
            </Button>
          </form>
        </CardContent>
        <CardFooter className="pt-6 flex flex-col sm:flex-row justify-between gap-3">
          <Button variant="outline" onClick={onGoBack} className="w-full sm:w-auto h-11"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Ingredients</Button>
          <Button onClick={onOrderReady} className="w-full sm:w-auto h-11 bg-accent text-accent-foreground hover:bg-accent/90">Order Ready <PackageCheck className="ml-2 h-4 w-4" /></Button>
        </CardFooter>
      </Card>

      {/* Desktop sticky live preview */}
      <div className="hidden lg:block lg:sticky lg:top-6">
        <BurgerPreview
          personName={personName}
          bunName={selectedBun?.name}
          pattyName={selectedPatty?.name}
          pattyQuantity={pattyQuantity}
          toppings={previewToppings}
        />
      </div>
    </div>
  );
};

export default BurgerCreator;
