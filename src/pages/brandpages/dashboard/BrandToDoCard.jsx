import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaTimes,
  FaChevronUp,
  FaChevronDown,
  FaSync,
  FaExternalLinkAlt,
  FaCheck,
} from 'react-icons/fa';
import axios from 'axios';
import config from '../../../config';

const KEY = 'brandCompletedTasks';
const doneIds = () => JSON.parse(localStorage.getItem(KEY) || '[]');
const addDone = (id) =>
  localStorage.setItem(KEY, JSON.stringify([...new Set([...doneIds(), id])]));

const Empty = ({ navigate }) => (
  <div className="flex flex-col items-center text-gray-400 py-8 space-y-2 text-center">
    <div className="text-5xl">🎉</div>
    <p className="text-sm">All caught up · no pending tasks</p>
    <button
      onClick={() => navigate('/brand/tasks')}
      className="text-lime-400 hover:text-lime-300 text-xs hover:underline cursor-pointer"
    >
      See all Tasks
    </button>
  </div>
);

export default function BrandToDoCardFixed() {
  const navigate = useNavigate();

  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTick, setRefreshTick] = useState(0);
  const [mini, setMini] = useState(false);
  const [show, setShow] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('BRAND_TOKEN');
    if (!token) return;

    try {
      const { data } = await axios.get(`${config.BACKEND_URL}/brand/tasks`, {
          headers: { Authorization: `Bearer ${token}` } 
  
      });
      if (data.status === 'success') setRaw(data.tasks);
    } catch (e) {
      console.error('[To‑Do] fetch failed', e);
      setRaw([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch, refreshTick]);

  const list = useMemo(() => {
    const done = doneIds();
    const prio = { tracking: 4, content: 3, extension: 2, application: 1, recruitment: 0 };
    return raw
      .filter((t) => !done.includes(t.id))
      .sort((a, b) => prio[b.type] - prio[a.type]);
  }, [raw]);

  const displayList = useMemo(() => {
    return showAll ? list : list.slice(0, 5);
  }, [list, showAll]);

  const mark = (id) => {
    addDone(id);
  };

  const label = {
    tracking: 'Input',
    content: 'Review',
    extension: 'Review',
    application: 'Review',
    recruitment: 'View',
    ending: 'View',
  };

  const link = (t) => {
    const base = `/brand/campaigns/${t.campaignId}`;
    switch (t.type) {
      case 'tracking':
        return `${base}?tab=creators&filter=trackingPending`;
      case 'content':
        return `${base}/content`;
      case 'extension':
        return `${base}?tab=creators&filter=extensionPending`;
      case 'application':
        return `${base}?tab=creators&filter=applied`;
      case 'recruitment':
      case 'ending':
      default:
        return `${base}?tab=creators`;
    }
  };

  const Card = ({ children, className = '' }) => (
    <div className={`${className} bg-[#1a1a1a] border border-white/20 rounded-2xl shadow-xl`}>
      <div className="flex justify-between items-center px-4 py-3 border-b border-white/10">
        <h3 className="text-sm font-semibold text-[#E0FFFA]">📋 Brand To-Do </h3>
        <div className="flex items-center gap-2 text-gray-400">
          <button onClick={() => setRefreshTick((v) => v + 1)} title="Refresh">
            <FaSync size={12} />
          </button>
          <button onClick={() => setMini((m) => !m)} title="Toggle Minimize">
            {mini ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
          </button>
          <button onClick={() => setShow(false)} title="Close">
            <FaTimes size={12} />
          </button>
        </div>
      </div>
      {!mini && children}
    </div>
  );

  const Rows = () =>
    loading ? (
      <div className="flex justify-center py-6">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-lime-500" />
      </div>
    ) : list.length === 0 ? (
      <Empty navigate={navigate} />
    ) : (
      <>
        {displayList.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between gap-3 bg-white/5 hover:bg-white/10 py-2 px-3 rounded-lg"
            title={t.description}
          >
            <span className="flex-1 text-gray-300 text-sm truncate">{t.description}</span>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => navigate(link(t))}
                className="flex items-center gap-1 text-xs bg-lime-500/20 hover:bg-lime-500/30 text-lime-400 px-2 py-1 rounded"
              >
                {label[t.type] || 'View'}
                <FaExternalLinkAlt className="w-3 h-3" />
              </button>
              <button
                onClick={() => mark(t.id)}
                className="p-1 text-green-400 hover:text-green-300"
                title="Mark as done"
              >
                <FaCheck className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {list.length > 5 && (
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="block w-full text-center text-xs text-gray-400 hover:text-lime-400"
          >
            {showAll ? 'Show Less' : 'Show More'} →
          </button>
        )}

        <button
          onClick={() => navigate('/brand/tasks')}
          className="block w-full text-center text-xs text-gray-400 hover:text-lime-400 border-t pt-3 border-white/10"
        >
          See All Tasks →
        </button>
      </>
    );

  if (!show) return null;

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block fixed bottom-[24px] right-[24px] w-[22.5rem] z-50">
        <Card>
          <div className="p-4 space-y-3">
            <Rows />
          </div>
        </Card>
      </div>

      {/* Mobile */}
      <div className="lg:hidden mx-lg-4 mt-6">
        <Card>
          <div className="p-4 space-y-3">
            <Rows />
          </div>
        </Card>
      </div>
    </>
  );
}
