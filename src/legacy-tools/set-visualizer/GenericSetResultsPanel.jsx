import React from "react";
import { PC_TO_NAME } from "./setData";
import { BassButtons } from "./SetControls";
import VoicingCard from "./VoicingCard";
import {
  buildOccurrenceSummary,
  formatDegreeList,
  formatIntervalVector,
  formatPitchClassList,
  getClassKey,
} from "./genericSetPageHelpers";

function ClassBadge({ children }) {
  return <span className="class-badge">{children}</span>;
}

function DetailChip({ label, value }) {
  return (
    <div className="detail-chip">
      <div className="detail-chip__label">{label}</div>
      <div className="detail-chip__value">{value}</div>
    </div>
  );
}

export default function GenericSetResultsPanel({
  showComplement,
  analysisMode,
  fretboardViewMode,
  noteName,
  displayMode,
  activeSet,
  selectedAnalysisClass,
  analysisMembers,
  canRenderAnalysisVoicings,
  selectedAnalysisMember,
  analysisBassFilter,
  analysisBassOptions,
  onAnalysisBassFilterChange,
  analysisShowAllVoicings,
  onAnalysisShowAllVoicingsChange,
  analysisShowAllMembers,
  analysisFilteredVoicings,
  analysisPrimaryFormVoicings,
  activeSelectedAnalysisVoicingIndex,
  onSelectAnalysisVoicing,
  analysisDegreeMap,
  analysisIntervalMap,
  complementName,
  complementData,
}) {
  const showingPrimaryForm = fretboardViewMode === "prime";
  const selectedOccurrenceSummary = buildOccurrenceSummary(
    analysisMode,
    activeSet,
    selectedAnalysisClass,
    selectedAnalysisMember
  );

  if (!showComplement && !analysisMode) {
    return null;
  }

  return (
    <div className="set-panel">
      {!showComplement ? (
        analysisMode ? (
          <>
            <div className="panel-header">
              <div className="panel-header__copy">
                <div className="eyebrow">Comparative analysis</div>
                <h2>Class detail</h2>
              </div>
              {selectedAnalysisClass && (
                <ClassBadge>{selectedAnalysisClass.forteName || "n/a"}</ClassBadge>
              )}
            </div>

            {selectedAnalysisClass && (
              <div className="analysis-card">
                <div className="panel-stack">
                  <div className="picker-head">
                    <div className="section-title">Class detail</div>
                    <ClassBadge>{selectedAnalysisClass.forteName || "n/a"}</ClassBadge>
                  </div>

                  <div className="detail-grid">
                    <DetailChip
                      label="Class"
                      value={selectedAnalysisClass.forteName || "n/a"}
                    />
                    <DetailChip
                      label="Prime form"
                      value={`[${selectedAnalysisClass.primeForm.join(",")}]`}
                    />
                    <DetailChip
                      label="Instances"
                      value={String(selectedAnalysisClass.concreteCount)}
                    />
                  </div>

                  {selectedAnalysisMember && selectedOccurrenceSummary && (
                    <div className="panel-stack">
                      <div className="picker-head">
                        <div className="section-title">Occurrence profile</div>
                        <ClassBadge>{selectedOccurrenceSummary.typeLabel}</ClassBadge>
                      </div>

                      <div className="detail-grid">
                        <DetailChip
                          label="Class relation"
                          value={selectedOccurrenceSummary.classTransform}
                        />
                        {analysisMode === "subsets" ? (
                          <>
                            <DetailChip
                              label="Present degrees"
                              value={formatDegreeList(
                                selectedOccurrenceSummary.retainedDegrees
                              )}
                            />
                            <DetailChip
                              label="Missing degrees"
                              value={formatDegreeList(
                                selectedOccurrenceSummary.missingDegrees
                              )}
                            />
                          </>
                        ) : (
                          <>
                            <DetailChip
                              label="Original core"
                              value={formatDegreeList(
                                selectedOccurrenceSummary.retainedDegrees
                              )}
                            />
                            <DetailChip
                              label="Added notes"
                              value={formatPitchClassList(
                                selectedOccurrenceSummary.addedPcs
                              )}
                            />
                          </>
                        )}
                      </div>

                      <p className="helper-text helper-text--small">
                        Concrete occurrence: [{selectedAnalysisMember.join(",")}]
                      </p>
                    </div>
                  )}

                  {canRenderAnalysisVoicings || showingPrimaryForm ? (
                    <>
                      {!showingPrimaryForm && (
                        <>
                          {!analysisShowAllMembers && (
                            <div className="control-card__stack">
                              <BassButtons
                                options={analysisBassOptions}
                                value={analysisBassFilter}
                                onChange={onAnalysisBassFilterChange}
                              />
                            </div>
                          )}
                        </>
                      )}

                      {!analysisShowAllMembers && (
                        <div className="toggle-stack">
                          <label className="toggle-row">
                            <input
                              type="checkbox"
                              checked={analysisShowAllVoicings}
                              onChange={(event) =>
                                onAnalysisShowAllVoicingsChange(event.target.checked)
                              }
                            />
                            Show all forms for this occurrence on the fretboard
                          </label>
                        </div>
                      )}

                      {showingPrimaryForm ? (
                        <p className="helper-text helper-text--small">
                          {analysisPrimaryFormVoicings.length} useful prime-form
                          positions available for this class.
                        </p>
                      ) : analysisShowAllMembers ? (
                        <p className="helper-text helper-text--small">
                          {analysisMembers.length} concrete instances of the class are
                          shown on the fretboard with one representative voicing each.
                        </p>
                      ) : (
                        <div className="panel-stack">
                          <div className="picker-head">
                            <div className="section-title">Forms / inversions</div>
                            <ClassBadge>{analysisFilteredVoicings.length}</ClassBadge>
                          </div>

                          <p className="helper-text helper-text--small">
                            {analysisFilteredVoicings.length} forms found for this
                            concrete occurrence.
                          </p>

                          <div className="results-scroll results-scroll--compact">
                            {analysisFilteredVoicings.map((voicing, index) => (
                              <VoicingCard
                                key={`${analysisMode}-${getClassKey(
                                  selectedAnalysisClass
                                )}-${selectedAnalysisMember?.join("-") || "member"}-${index}-${voicing.positions
                                  .map((position) => `${position.stringIndex}-${position.fret}`)
                                  .join("-")}`}
                                voicing={voicing}
                                index={index}
                                selected={index === activeSelectedAnalysisVoicingIndex}
                                onSelect={() => onSelectAnalysisVoicing(index)}
                                displayMode={displayMode}
                                showPrimeForm={true}
                                showForte={true}
                                degreeMap={analysisDegreeMap}
                                intervalMap={analysisIntervalMap}
                              />
                            ))}

                            {analysisFilteredVoicings.length === 0 && (
                              <p className="empty-note">
                                No voicings available with the current filters.
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="empty-note">
                      No simultaneous voicings are shown for this occurrence.
                      The fretboard still shows the full pitch-class collection.
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        ) : null
      ) : (
        <>
          <div className="panel-header">
            <div className="panel-header__copy">
              <div className="eyebrow">Complement analysis</div>
              <h2>Analytical details</h2>
            </div>
          </div>

          {activeSet && complementData && (
            <div className="data-list">
              <div>
                <strong>Source {noteName}:</strong>{" "}
                {activeSet.forteName}
              </div>
              <div>
                <strong>Active transformation:</strong> {activeSet.transformLabel}
              </div>
              <div>
                <strong>Prime form:</strong> ({activeSet.pf})
              </div>
              <div>
                <strong>Interval vector:</strong> {formatIntervalVector(activeSet.iv)}
              </div>

              <div className="complement-card">
                <div>
                  <strong>{complementName}:</strong> {complementData.forte}
                </div>
                <div>
                  <strong>Prime form:</strong> ({complementData.pf})
                </div>
                <div>
                  <strong>Interval vector:</strong> {formatIntervalVector(complementData.iv)}
                </div>
                <div>
                  <strong>Pitch classes:</strong>{" "}
                  {complementData.pcs.map((pc) => PC_TO_NAME[pc]).join(" - ")}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
