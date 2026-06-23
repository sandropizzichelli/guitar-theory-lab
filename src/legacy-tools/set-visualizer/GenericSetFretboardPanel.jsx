import React from "react";
import Fretboard from "./Fretboard";
import { PC_TO_NAME } from "./setData";
import {
  buildOccurrenceSummary,
  formatIntervalVector,
  getIntervalStyle,
} from "./genericSetPageHelpers";

function ActiveIntervalLegend({ selectedIntervalClasses }) {
  if (!selectedIntervalClasses.length) return null;

  return (
    <div className="interval-connection-legend">
      {selectedIntervalClasses.map((intervalClass) => {
        const palette = getIntervalStyle(intervalClass);

        return (
          <div key={`active-ic-${intervalClass}`} className="interval-connection-legend__chip">
            <span
              className="interval-connection-legend__swatch"
              style={{
                background: `linear-gradient(135deg, ${palette.solid[0]} 0%, ${palette.solid[1]} 100%)`,
                boxShadow: `0 0 0 3px ${palette.soft[0]}`,
              }}
            />
            <strong>{`ic${intervalClass}`}</strong>
          </div>
        );
      })}
    </div>
  );
}

function IntervalLegend({
  title,
  legend,
  breakdown,
  vector,
  selectedIntervalClasses,
  onToggleIntervalClass,
  onClearIntervalClassFilter,
  notePrefix = "Reference 0",
}) {
  if (!legend?.length) return null;

  const hasActiveFilter = selectedIntervalClasses.length > 0;

  return (
    <div className="interval-legend-panel">
      <div className="picker-head">
        <div className="section-title">{title}</div>
        <div className="interval-legend-panel__actions">
          {hasActiveFilter && (
            <button
              type="button"
              onClick={onClearIntervalClassFilter}
              className="interval-filter-reset"
            >
              Show all
            </button>
          )}
          {vector && <span className="class-badge">{formatIntervalVector(vector)}</span>}
        </div>
      </div>

      <div className="interval-legend">
        {legend.map((item) => (
          <div key={`${item.pc}-${item.label}`} className="interval-legend__chip">
            <span>{item.label}</span>
            <strong>{PC_TO_NAME[item.pc]}</strong>
          </div>
        ))}
      </div>

      <div className="interval-breakdown interval-breakdown--compact">
        {breakdown.map((item) => (
          <button
            key={item.ic}
            type="button"
            onClick={() => onToggleIntervalClass(item.ic)}
            disabled={item.count === 0}
            className={
              selectedIntervalClasses.includes(item.ic)
                ? "interval-breakdown__chip interval-breakdown__chip--active"
                : "interval-breakdown__chip"
            }
          >
            <span>{`ic${item.ic}`}</span>
            <strong>{item.count}</strong>
          </button>
        ))}
      </div>

      <p className="helper-text helper-text--small">
        {notePrefix}: {PC_TO_NAME[legend[0].pc]}
      </p>
      <ActiveIntervalLegend selectedIntervalClasses={selectedIntervalClasses} />
      <p className="helper-text helper-text--small">
        Click an `ic` to isolate only the notes involved in that interval-class
        family on the fretboard.
      </p>
    </div>
  );
}

function OccurrenceRelationLegend({ analysisMode, summary }) {
  if (!summary) return null;

  return (
    <div className="analysis-card analysis-card--compact">
      <div className="picker-head">
        <div className="section-title">Fretboard reading</div>
        <span className="class-badge">{summary.typeLabel}</span>
      </div>

      <div className="occurrence-fretboard-legend">
        <div className="occurrence-fretboard-legend__chip">
          <span className="occurrence-fretboard-legend__swatch occurrence-fretboard-legend__swatch--core" />
          <div>
            <strong>Core</strong>
            <span>
              {analysisMode === "subsets"
                ? "notes present in the occurrence"
                : "retained notes from the parent set"}
            </span>
          </div>
        </div>

        {analysisMode === "subsets" ? (
          <div className="occurrence-fretboard-legend__chip">
            <span className="occurrence-fretboard-legend__swatch occurrence-fretboard-legend__swatch--missing" />
            <div>
              <strong>Missing degrees</strong>
              <span>{summary.missingPcs.map((pc) => PC_TO_NAME[pc]).join(" · ") || "none"}</span>
            </div>
          </div>
        ) : (
          <div className="occurrence-fretboard-legend__chip">
            <span className="occurrence-fretboard-legend__swatch occurrence-fretboard-legend__swatch--added" />
            <div>
              <strong>Added notes</strong>
              <span>{summary.addedPcs.map((pc) => PC_TO_NAME[pc]).join(" · ") || "none"}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FretboardStage({ title, badge, children }) {
  return (
    <div className="analysis-card analysis-card--fretboard">
      <div className="picker-head">
        <div className="section-title">{title}</div>
        <span className="class-badge">{badge}</span>
      </div>
      {children}
    </div>
  );
}

export default function GenericSetFretboardPanel({
  browseMode,
  showComplement,
  hideFretboardVisual = false,
  analysisMode,
  fretboardViewMode,
  noteName,
  activeSet,
  selectedVoicing,
  filteredVoicings,
  primaryFormVoicing,
  primaryFormVoicings,
  primaryFormDegreeMap,
  primaryFormIntervalMap,
  primaryFormIntervalLegend,
  showAll,
  displayMode,
  intervalVectorFamilyClasses,
  selectedIntervalVector,
  selectedIntervalClasses,
  onToggleIntervalClass,
  onClearIntervalClassFilter,
  filteredPrimaryTargetPcs,
  filteredPrimaryFormTargetPcs,
  selectedAnalysisClass,
  selectedAnalysisMember,
  filteredAnalysisTargetPcs,
  filteredAnalysisPrimaryFormTargetPcs,
  canRenderAnalysisVoicings,
  selectedAnalysisVoicing,
  analysisFilteredVoicings,
  analysisPrimaryFormVoicing,
  analysisPrimaryFormVoicings,
  analysisPrimaryFormDegreeMap,
  analysisPrimaryFormIntervalMap,
  analysisPrimaryFormIntervalLegend,
  analysisShowAllVoicings,
  analysisDegreeMap,
  analysisIntervalMap,
  analysisIntervalLegend,
  analysisIntervalClassBreakdown,
  complementData,
}) {
  if (hideFretboardVisual) {
    return null;
  }

  const showIntervalLegend = browseMode === "iv" || displayMode === "intervals";
  const showingPrimaryForm = fretboardViewMode === "prime";
  const canRenderAnalysisPrimaryForm =
    Boolean(selectedAnalysisClass?.primeForm?.length) &&
    Boolean(analysisPrimaryFormVoicing);
  const selectedOccurrenceSummary =
    !showingPrimaryForm && analysisMode
      ? buildOccurrenceSummary(
          analysisMode,
          activeSet,
          selectedAnalysisClass,
          selectedAnalysisMember
        )
      : null;
  const analysisPcRoleMap = new Map();

  selectedOccurrenceSummary?.retainedPcs.forEach((pc) => {
    analysisPcRoleMap.set(pc, "core");
  });
  selectedOccurrenceSummary?.addedPcs.forEach((pc) => {
    analysisPcRoleMap.set(pc, "added");
  });
  selectedOccurrenceSummary?.missingPcs.forEach((pc) => {
    if (!analysisPcRoleMap.has(pc)) {
      analysisPcRoleMap.set(pc, "missing");
    }
  });

  return (
    <div className="set-panel set-panel--fretboard-panel">
      <div className="panel-header">
        <div className="panel-header__copy">
          <div className="eyebrow">
            {hideFretboardVisual ? "Set reading" : "Fretboard space"}
          </div>
          <h2>{hideFretboardVisual ? "Analysis" : "Fretboard"}</h2>
        </div>
        {!showComplement && activeSet && (
          <span className="class-badge">{activeSet.transformLabel}</span>
        )}
      </div>

      {!showComplement ? (
        !analysisMode ? (
          <div className="panel-stack panel-stack--spacious">
            <p className="helper-text">
              {hideFretboardVisual
                ? showingPrimaryForm
                  ? "The active fretboard is now in the upper box. Below you will find the theoretical and intervallic references for the prime form."
                  : `The active fretboard is now in the upper box. Below you will find useful references for reading the current ${noteName}.`
                : showingPrimaryForm
                  ? "The fretboard shows the prime form as a compact playable fingering: each note is placed in the closest available position, changing strings when that produces a tighter shape. Enable the checkbox to see all resulting forms."
                  : `Dimmed cells belong to the transformed ${noteName}. Highlighted cells show the selected form, or all forms when that option is active.`}
            </p>

            {activeSet && !hideFretboardVisual && (
              <div className="analysis-card analysis-card--compact">
                <div className="panel-stack">
                  <div className="info-note">
                    Prime form of the {noteName}: [{activeSet.primeForm.join(",")}] |
                    ordered transform: [{activeSet.transformedPrimeForm.join(",")}]
                  </div>
                  <div className="info-note">
                    Forte name of the {noteName}: {activeSet.forteName}
                    {browseMode === "iv" && (
                      <>
                        {" | "}
                        IV family: {formatIntervalVector(selectedIntervalVector)} ({intervalVectorFamilyClasses.length} classes)
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {showIntervalLegend && activeSet && (
              <IntervalLegend
                title={
                  showingPrimaryForm
                    ? "Prime-form interval map"
                    : "Interval map"
                }
                legend={showingPrimaryForm ? primaryFormIntervalLegend : activeSet.intervalLegend}
                breakdown={activeSet.intervalClassBreakdown}
                vector={activeSet.iv}
                selectedIntervalClasses={selectedIntervalClasses}
                onToggleIntervalClass={onToggleIntervalClass}
                onClearIntervalClassFilter={onClearIntervalClassFilter}
              />
            )}

            {selectedIntervalClasses.length > 0 && !showAll && (
              <div className="info-note info-note--accent">
                The fretboard lines connect the notes of the{" "}
                {showingPrimaryForm ? "prime form" : "selected form"} that
                produce the `ic{selectedIntervalClasses.join(", ic")}` intervals.
              </div>
            )}

            {!hideFretboardVisual && (
              <FretboardStage
                title="Fretboard view"
                badge={
                  showingPrimaryForm
                    ? "Prime form"
                    : showAll
                      ? "All forms"
                      : "Selected form"
                }
              >
                <Fretboard
                  voicing={showingPrimaryForm ? primaryFormVoicing : selectedVoicing}
                  allTargetPcs={
                    showingPrimaryForm
                      ? filteredPrimaryFormTargetPcs
                      : filteredPrimaryTargetPcs
                  }
                  allVoicings={showingPrimaryForm ? primaryFormVoicings : filteredVoicings}
                  showAll={showAll}
                  displayMode={displayMode}
                  degreeMap={showingPrimaryForm ? primaryFormDegreeMap : activeSet?.degreeMap}
                  intervalMap={showingPrimaryForm ? primaryFormIntervalMap : activeSet?.intervalMap}
                  selectedIntervalClasses={selectedIntervalClasses}
                  showTargetMap={!showingPrimaryForm}
                  expandOccurrencesInShowAll={showingPrimaryForm}
                />
              </FretboardStage>
            )}
          </div>
        ) : (
          <div className="panel-stack panel-stack--spacious">
            <p className="helper-text">
              {hideFretboardVisual
                ? showingPrimaryForm
                  ? "The active fretboard is in the upper box. Below you will find the theoretical profile of the selected prime form."
                  : "The active fretboard is in the upper box. Below you will find the structural reading of the selected concrete occurrence."
                : showingPrimaryForm
                  ? "Select a class on the right. The fretboard shows the prime form as a compact playable fingering, or all its forms when the checkbox is active."
                  : "Select a class on the right. The fretboard shows the chosen concrete occurrence and, when possible, its voicings or inversions."}
            </p>

            {selectedAnalysisClass && !hideFretboardVisual && (
              <div className="analysis-card analysis-card--compact">
                <div className="panel-stack">
                  <div className="info-note">
                    Selected class: {selectedAnalysisClass.forteName || "n/a"} | PF
                    [{selectedAnalysisClass.primeForm.join(",")}] | IV {formatIntervalVector(selectedAnalysisClass.iv)}
                  </div>

                  {selectedAnalysisMember && (
                    <div className="info-note">
                      Concrete occurrence: [{selectedAnalysisMember.join(",")}]
                    </div>
                  )}
                </div>
              </div>
            )}

            {showIntervalLegend && selectedAnalysisClass && (
              <IntervalLegend
                title={
                  showingPrimaryForm
                    ? "Prime-form interval profile"
                    : "Occurrence interval profile"
                }
                legend={
                  showingPrimaryForm
                    ? analysisPrimaryFormIntervalLegend
                    : analysisIntervalLegend
                }
                breakdown={analysisIntervalClassBreakdown}
                vector={selectedAnalysisClass.iv}
                selectedIntervalClasses={selectedIntervalClasses}
                onToggleIntervalClass={onToggleIntervalClass}
                onClearIntervalClassFilter={onClearIntervalClassFilter}
                notePrefix="Occurrence reference 0"
              />
            )}

            <OccurrenceRelationLegend
              analysisMode={analysisMode}
              summary={selectedOccurrenceSummary}
            />

            {selectedAnalysisMember && !canRenderAnalysisVoicings && (
              <div className="info-note">
                Cardinality {selectedAnalysisMember.length}: the fretboard shows the
                occurrence pitch classes, not a simultaneous voicing.
              </div>
            )}

            {!hideFretboardVisual && (
              <FretboardStage
                title="Fretboard view"
                badge={
                    showingPrimaryForm
                      ? analysisShowAllVoicings
                        ? "Layered prime forms"
                        : "Prime form"
                    : analysisShowAllVoicings
                      ? "Layered positions"
                      : "Selected occurrence"
                }
              >
                <Fretboard
                  voicing={
                    showingPrimaryForm
                      ? canRenderAnalysisPrimaryForm
                        ? analysisPrimaryFormVoicing
                        : null
                      : canRenderAnalysisVoicings
                        ? selectedAnalysisVoicing
                        : null
                  }
                  allTargetPcs={
                    showingPrimaryForm
                      ? filteredAnalysisPrimaryFormTargetPcs
                      : filteredAnalysisTargetPcs
                  }
                  allVoicings={
                    showingPrimaryForm
                      ? analysisPrimaryFormVoicings
                      : !canRenderAnalysisVoicings
                        ? []
                        : analysisFilteredVoicings
                  }
                  showAll={
                    showingPrimaryForm
                      ? analysisShowAllVoicings
                      : !canRenderAnalysisVoicings
                        ? false
                        : analysisShowAllVoicings
                  }
                  displayMode={displayMode}
                  degreeMap={
                    showingPrimaryForm
                      ? analysisPrimaryFormDegreeMap
                      : analysisDegreeMap
                  }
                  intervalMap={
                    showingPrimaryForm
                      ? analysisPrimaryFormIntervalMap
                      : analysisIntervalMap
                  }
                  selectedIntervalClasses={selectedIntervalClasses}
                  showTargetMap={!showingPrimaryForm}
                  extraTargetPcs={
                    showingPrimaryForm || !selectedOccurrenceSummary
                      ? []
                      : selectedOccurrenceSummary.missingPcs
                  }
                  pcRoleMap={showingPrimaryForm ? null : analysisPcRoleMap}
                  expandOccurrencesInShowAll={showingPrimaryForm}
                />
              </FretboardStage>
            )}
          </div>
        )
      ) : (
        <div className="panel-stack panel-stack--spacious">
          <p className="helper-text">
            {hideFretboardVisual
              ? `The active fretboard in the upper box shows the complement of the active ${noteName} transformation.`
              : `Highlighted cells show the complement of the active ${noteName} transformation.`}
          </p>

          {!hideFretboardVisual && (
            <FretboardStage title="Fretboard view" badge="Complement">
              <Fretboard
                voicing={null}
                allTargetPcs={complementData ? complementData.pcs : []}
                allVoicings={[]}
                showAll={false}
                displayMode="notes"
                degreeMap={null}
                intervalMap={null}
                highlightAllAsActive={true}
              />
            </FretboardStage>
          )}
        </div>
      )}
    </div>
  );
}
