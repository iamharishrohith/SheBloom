'use client';

import { useState } from 'react';
import { UtensilsCrossed, Apple, CheckCircle2, Clock, Droplets, ChevronDown, ChevronUp, Flame, Leaf, Sparkles } from 'lucide-react';
import VerifyBadge from '@/components/VerifyBadge';
import ExplainDialog from '@/components/ExplainDialog';
import styles from './meals.module.css';

const TODAY_MEALS = [
  {
    type: 'Breakfast', time: '08:00 AM', title: 'Oats with Almonds & Dates',
    focus: 'Iron & Energy', icon: <UtensilsCrossed size={20} />, status: 'completed',
    tips: 'Pair with a glass of orange juice (Vitamin C) to boost iron absorption.',
    nutrients: [{ label: 'Iron', value: '4.5mg' }, { label: 'Fiber', value: '8g' }, { label: 'Protein', value: '12g' }],
    recipe: ['1 cup rolled oats, cooked', '10 almonds, chopped', '3 dates, chopped', '1 tbsp honey', '1 glass orange juice on the side']
  },
  {
    type: 'Mid-Morning Snack', time: '11:00 AM', title: 'Fresh Fruits & Coconut Water',
    focus: 'Hydration', icon: <Droplets size={20} />, status: 'pending',
    tips: 'Essential to prevent UTI and keep amniotic fluid levels stable.',
    nutrients: [{ label: 'Potassium', value: '450mg' }, { label: 'Vitamin C', value: '85mg' }],
    recipe: ['1 banana', '1 apple, sliced', '200ml coconut water', 'Handful of grapes']
  },
  {
    type: 'Lunch', time: '01:30 PM', title: 'Spinach Dal, Roti & Curd',
    focus: 'Protein & Calcium', icon: <UtensilsCrossed size={20} />, status: 'pending',
    tips: 'Keep curd separate from any iron supplements by at least 2 hours.',
    nutrients: [{ label: 'Protein', value: '18g' }, { label: 'Calcium', value: '200mg' }, { label: 'Iron', value: '6mg' }],
    recipe: ['1 cup spinach dal (palak dal)', '2 whole wheat rotis', '1 cup fresh curd', 'Side salad with lemon dressing']
  },
  {
    type: 'Evening Snack', time: '05:00 PM', title: 'Roasted Makhana (Fox Nuts)',
    focus: 'Calcium', icon: <Apple size={20} />, status: 'pending',
    tips: 'A great low-GI snack for gestational diabetes prevention.',
    nutrients: [{ label: 'Calcium', value: '160mg' }, { label: 'Magnesium', value: '45mg' }],
    recipe: ['1 cup makhana, dry roasted', 'Pinch of salt and turmeric', 'Optional: 5 cashews']
  },
  {
    type: 'Dinner', time: '08:00 PM', title: 'Paneer Tikka with Brown Rice',
    focus: 'Protein & Folate', icon: <Flame size={20} />, status: 'pending',
    tips: 'Paneer is an excellent vegetarian protein source during pregnancy.',
    nutrients: [{ label: 'Protein', value: '22g' }, { label: 'Folate', value: '120μg' }, { label: 'Calcium', value: '300mg' }],
    recipe: ['200g paneer tikka (grilled)', '1 cup brown rice', 'Mixed vegetable side', 'Mint chutney']
  },
  {
    type: 'Before Bed', time: '09:30 PM', title: 'Warm Milk with Turmeric',
    focus: 'Sleep & Immunity', icon: <Leaf size={20} />, status: 'pending',
    tips: 'Turmeric has anti-inflammatory properties. Take calcium supplement with this.',
    nutrients: [{ label: 'Calcium', value: '250mg' }, { label: 'Tryptophan', value: '12mg' }],
    recipe: ['1 glass warm milk', '½ tsp turmeric powder', 'Pinch of black pepper (aids absorption)', '1 tsp honey (optional)']
  },
];

export default function MealsPage() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [completed, setCompleted] = useState(new Set(['0']));
  const [activeExplainTask, setActiveExplainTask] = useState(null);

  const toggle = (i) => setExpandedIndex(expandedIndex === i ? null : i);
  const toggleComplete = (i) => {
    setCompleted(prev => {
      const next = new Set(prev);
      const key = String(i);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.headerIcon}><UtensilsCrossed size={32} /></div>
        <h1>Nutrition Plan</h1>
        <p>Doctor-verified meal suggestions tailored for her trimester & conditions</p>
        <VerifyBadge level="doctor" size="md" citation="WHO & NHM Guidelines" />
      </header>

      {/* Daily Summary */}
      <div className={styles.dailySummary}>
        <div className={styles.summaryItem}><strong>6</strong> meals planned</div>
        <div className={styles.summaryItem}><strong>{completed.size}</strong> completed</div>
        <div className={styles.summaryItem}><strong>~1800</strong> kcal target</div>
      </div>

      <section className={styles.timeline}>
        {TODAY_MEALS.map((meal, i) => {
          const isDone = completed.has(String(i));
          const isExpanded = expandedIndex === i;
          return (
            <div key={i} className={`${styles.mealCard} ${isDone ? styles.completed : ''}`}>
              <div className={styles.mealTime}>
                <Clock size={16} />
                <span>{meal.time}</span>
              </div>

              <div className={styles.cardContent}>
                <div className={styles.cardHeader} onClick={() => toggle(i)}>
                  <div className={styles.tag}>{meal.type}</div>
                  <div className={styles.expandIcon}>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                <h3 className={styles.mealTitle}>{meal.title}</h3>
                <p className={styles.mealFocus}><Leaf size={14} /> Key Focus: {meal.focus}</p>

                {/* Nutrients */}
                <div className={styles.nutrients}>
                  {meal.nutrients.map((n, j) => (
                    <span key={j} className={styles.nutrient}>{n.label}: <strong>{n.value}</strong></span>
                  ))}
                </div>

                <div className={styles.tipsBox}>
                  <p>{meal.tips}</p>
                </div>
                
                <button 
                  className={styles.explainBtn} 
                  onClick={() => setActiveExplainTask({ name: meal.title, context: 'nutrition' })}
                  style={{ marginBottom: '1rem', background: 'none', border: '1px solid var(--color-primary)', color: 'var(--color-primary-dark)', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: 'var(--radius-pill)', fontSize: 'var(--fs-tiny)', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  <Sparkles size={14} /> AI Explain
                </button>

                {/* Expanded: recipe */}
                {isExpanded && (
                  <div className={styles.recipeBox}>
                    <strong>What to prepare:</strong>
                    <ul>
                      {meal.recipe.map((step, k) => <li key={k}>{step}</li>)}
                    </ul>
                  </div>
                )}

                {/* Complete Button */}
                <button className={`${styles.completeBtn} ${isDone ? styles.completedBtn : ''}`} onClick={() => toggleComplete(i)}>
                  {isDone ? <><CheckCircle2 size={16} /> Completed</> : <>Mark as Done</>}
                </button>
              </div>
            </div>
          );
        })}
      </section>
      {activeExplainTask && <ExplainDialog task={activeExplainTask} onClose={() => setActiveExplainTask(null)} />}
    </div>
  );
}
