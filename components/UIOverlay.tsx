
import React from 'react';
import { BuildingType, Era, GameState } from '../types';
import { BUILDING_COSTS, LABELS } from '../constants';

interface UIOverlayProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ gameState, setGameState }) => {
  
  const selectBuilding = (type: BuildingType) => {
    setGameState(prev => ({ ...prev, selectedBuildingType: type }));
  };

  const getEraLabel = (era: Era) => {
      switch(era) {
          case Era.WILD_WEST: return 'המערב הפרוע';
          case Era.INDUSTRIAL: return 'המהפכה התעשייתית';
          case Era.MODERN: return 'העידן המודרני';
          case Era.FUTURE: return 'העתיד';
          default: return era;
      }
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex flex-col justify-between md:block">
      
      {/* --- TOP RIGHT INFO PANEL (Desktop) / TOP BAR (Mobile) --- */}
      <div className="pointer-events-auto w-full md:absolute md:top-4 md:right-4 md:w-64 flex flex-col gap-2 md:gap-3">
        
        {/* Main Stats Card */}
        <div className="bg-black/80 text-white p-3 md:p-4 md:rounded-xl border-b md:border border-white/10 backdrop-blur-md shadow-lg flex md:flex-col justify-between items-center md:items-start gap-2">
          
          {/* Header: Year & Era */}
          <div className="flex flex-col items-start border-r md:border-r-0 md:border-b border-white/20 pr-4 md:pr-0 md:pb-2 md:mb-2 md:w-full">
             <span className="text-2xl md:text-3xl font-bold font-mono text-yellow-400 tracking-wider">{Math.floor(gameState.year)}</span>
             <span className="text-[10px] md:text-xs uppercase tracking-widest text-gray-400">{getEraLabel(gameState.era)}</span>
          </div>

          {/* Resources */}
          <div className="flex md:flex-col gap-4 md:gap-2 items-center md:items-start pl-4 md:pl-0 w-full">
              <div className="flex items-center justify-between w-full">
                  <span className="text-gray-400 text-xs md:text-sm">תקציב:</span>
                  <span className="text-green-400 text-lg font-bold">${Math.floor(gameState.money).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between w-full">
                  <span className="text-gray-400 text-xs md:text-sm">תושבים:</span>
                  <span className="text-blue-300 text-sm font-bold">{Math.floor(gameState.population).toLocaleString()}</span>
              </div>
          </div>
        </div>

        {/* News Ticker (Compact on Desktop) */}
        <div className="bg-blue-900/90 md:rounded-xl border-y md:border border-blue-500/30 backdrop-blur-sm p-2 md:p-3 shadow-lg">
           <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold bg-blue-600 px-1.5 rounded text-white">חדשות</span>
           </div>
           <div className="text-white text-xs md:text-sm leading-tight h-8 md:h-auto overflow-hidden md:line-clamp-3">
              {gameState.isLoadingAI ? "מנתח נתונים..." : gameState.newsFeed}
           </div>
        </div>
        
        {/* Active Mission Card */}
        {gameState.mission && (
            <div className="bg-yellow-900/90 text-yellow-100 p-3 md:rounded-xl border-y md:border border-yellow-600/50 shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-top-4">
                <h4 className="text-[10px] font-bold uppercase text-yellow-500 mb-1">משימה פעילה</h4>
                <p className="text-xs md:text-sm font-bold leading-tight">{gameState.mission.description}</p>
                <div className="w-full bg-black/30 h-1.5 rounded-full mt-2 overflow-hidden">
                   <div className="bg-yellow-500 h-full w-full animate-pulse opacity-50"></div>
                </div>
            </div>
        )}
      </div>

      {/* --- LEFT SIDEBAR (Desktop) / BOTTOM BAR (Mobile) --- */}
      <div className="pointer-events-auto w-full bg-black/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-t md:border-t-0 border-white/10 md:absolute md:left-4 md:top-4 md:bottom-4 md:w-36 flex flex-col justify-end md:justify-start">
        
        {/* Inner Container */}
        <div className="md:bg-black/80 md:backdrop-blur-md md:border md:border-white/10 md:rounded-xl md:h-full overflow-hidden flex flex-col">
            
            <div className="hidden md:block p-2 text-center bg-white/5 border-b border-white/10">
                <span className="text-xs text-gray-400 font-bold">בנייה</span>
            </div>

            {/* Scrollable Area */}
            <div className="p-2 md:p-2 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto scrollbar-hide md:h-full">
                <div className="flex md:flex-col gap-2 min-w-max md:min-w-0 pb-safe md:pb-0">
                {Object.values(BuildingType).map((type) => {
                    const isDemolish = type === BuildingType.DEMOLISH;
                    const isSelected = gameState.selectedBuildingType === type;
                    
                    return (
                    <button
                        key={type}
                        onClick={() => selectBuilding(type)}
                        className={`
                        flex flex-col items-center justify-center p-2 md:p-3 rounded-lg md:rounded-xl border transition-all active:scale-95
                        min-w-[70px] md:w-full md:min-h-[80px]
                        ${isSelected 
                            ? (isDemolish 
                                ? 'bg-red-500/20 border-red-400 shadow-[inset_0_0_10px_rgba(239,68,68,0.3)]' 
                                : 'bg-yellow-500/20 border-yellow-400 shadow-[inset_0_0_10px_rgba(250,204,21,0.3)]')
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'}
                        `}
                    >
                        <span className="text-2xl md:text-3xl mb-1 filter drop-shadow-lg">
                        {type === BuildingType.RESIDENTIAL && '🏠'}
                        {type === BuildingType.COMMERCIAL && '🏢'}
                        {type === BuildingType.INDUSTRIAL && '🏭'}
                        {type === BuildingType.ROAD && '🛣️'}
                        {type === BuildingType.BRIDGE && '🌉'}
                        {type === BuildingType.SHERIFF && '👮'}
                        {type === BuildingType.MAYOR && '🏛️'}
                        {type === BuildingType.HOSPITAL && '🏥'}
                        {type === BuildingType.STABLE && '🐎'}
                        {type === BuildingType.BLACKSMITH && '⚒️'}
                        {type === BuildingType.FARM && '🌾'}
                        {type === BuildingType.FOREST && '🌲'}
                        {type === BuildingType.DEMOLISH && '🔨'}
                        {type === BuildingType.GOLD_MINE && '⛏️'}
                        {type === BuildingType.SILVER_MINE && '⛏️'}
                        {type === BuildingType.COAL_MINE && '⛏️'}
                        </span>
                        <span className={`text-[10px] md:text-xs font-bold text-center leading-tight ${isDemolish ? 'text-red-300' : 'text-gray-200'}`}>
                            {LABELS[type]}
                        </span>
                        <span className={`text-[9px] md:text-[10px] font-mono mt-0.5 ${isDemolish ? 'text-red-400' : 'text-green-400'}`}>
                            {BUILDING_COSTS[type] > 0 ? `-$${BUILDING_COSTS[type]}` : 'חינם'}
                        </span>
                    </button>
                    );
                })}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UIOverlay;
