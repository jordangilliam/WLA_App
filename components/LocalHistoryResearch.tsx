'use client';

import { useState } from 'react';

interface ResearchPrompt {
  id: string;
  title: string;
  icon: string;
  description: string;
  chatGPTPrompt: string;
  researchQuestions: string[];
  criticalThinking: string[];
  paExample?: {
    location: string;
    story: string;
    conflictingAccounts: string[];
    lesson: string;
  };
}

const RESEARCH_PROMPTS: ResearchPrompt[] = [
  {
    id: 'community-history',
    title: 'Your Community\'s Conservation History',
    icon: '🏘️',
    description: 'Discover the hidden conservation stories in your own community',
    chatGPTPrompt: `I live in [YOUR TOWN/CITY], Pennsylvania. Please help me research:

1. What Indigenous peoples originally lived in this area? What were their relationships with the land and wildlife?

2. What major environmental changes happened here during colonial settlement and industrialization? (deforestation, mining, pollution, etc.)

3. What conservation efforts or environmental movements have taken place in my community?

4. Are there any local parks, preserves, or conservation areas? What's their history?

5. What wildlife species were lost from this area? Have any been restored?

6. Are there any local conservation heroes or environmental advocates I should know about?

Please provide specific dates, names, and sources where possible.`,
    researchQuestions: [
      'What Indigenous nation(s) originally inhabited your area?',
      'What were the major industries that changed the landscape? (coal, steel, lumber, agriculture)',
      'When were local parks or conservation areas established? Why?',
      'Has your community experienced any major environmental disasters or pollution events?',
      'What wildlife has returned to your area after being absent?',
      'Who are local conservation advocates working today?'
    ],
    criticalThinking: [
      'Who wrote the history you\'re reading? What perspective might they have?',
      'Whose voices are missing from the official history?',
      'How do Indigenous accounts differ from colonial/government accounts?',
      'What economic or political interests might influence how history is told?',
      'How has the landscape physically changed? (Look at old maps vs. today)',
      'What sources are most trustworthy? Government records? Oral histories? Peer-reviewed research?'
    ]
  },
  {
    id: 'local-parks',
    title: 'Local Parks & Preserves History',
    icon: '🌳',
    description: 'Research the origin story of your favorite local park',
    chatGPTPrompt: `I want to research [PARK NAME], Pennsylvania. Please help me find:

1. When was this park established? What was the land used for before it became a park?

2. Why was it protected? Was there a conservation threat or advocate who pushed for protection?

3. If it\'s named after a person or place, who/what is that? What\'s the real story?

4. What wildlife, plants, or natural features make this park special?

5. Have there been any controversies about the park's history or name?

6. What Indigenous peoples lived on this land before European settlement?

7. Are there conflicting historical accounts about this place? What are they?

Provide sources for this information, especially peer-reviewed sources.`,
    researchQuestions: [
      'What was here before the park? (Farm, forest, industrial site, Indigenous village)',
      'Who donated or sold the land? Why?',
      'Is the park named after a real person? What\'s their true story?',
      'Have any rare or endangered species been found here?',
      'What restoration work has been done?',
      'Are there historical structures or archaeological sites in the park?'
    ],
    criticalThinking: [
      'Do the park signs tell the whole story?',
      'Are Indigenous perspectives included in the park\'s interpretation?',
      'If named after a person, is the portrayal accurate or romanticized?',
      'What happened to people who lived here before the park?',
      'Who benefits from the park today? Who might be excluded?',
      'How do different sources (government, academic, oral history) tell different stories?'
    ],
    paExample: {
      location: 'Bald Eagle State Park (Centre County)',
      story: 'The park is named after Chief Bald Eagle of the Lenape people, but the story of his death has conflicting accounts that reveal important lessons about historical sources.',
      conflictingAccounts: [
        '**Popular/Romantic Version**: Chief Bald Eagle was a peaceful leader who was tragically murdered by a white settler in an unprovoked attack. He\'s remembered as a noble figure who tried to maintain peace.',
        '**Peer-Reviewed Historical Research**: Academic historians studying primary sources (legal records, witness accounts, land deeds) have found more complex details. Some accounts suggest conflict over land rights, broken treaties, and economic pressures. The circumstances of his death involve legal disputes and may not have been a simple murder.',
        '**Indigenous Oral Histories**: Lenape descendants have their own accounts passed down through generations, which may include details not recorded in colonial documents.',
        '**Local Folklore**: Stories passed down in the settler community that may romanticize or vilify different parties.'
      ],
      lesson: 'This example shows why **peer-reviewed sources matter**. Teachers prefer them because they\'ve been fact-checked by other experts and cite primary documents. BUT we must also consider: Who had the power to create written records? Whose stories were written down? Whose were dismissed or lost? The best history uses multiple sources and acknowledges uncertainty.'
    }
  },
  {
    id: 'extractive-history',
    title: 'Extractive Industries Impact',
    icon: '⛏️',
    description: 'Investigate how mining, logging, or industry affected your watershed',
    chatGPTPrompt: `I want to research the environmental impact of [INDUSTRY TYPE] in [REGION], Pennsylvania. Please help me understand:

1. When did this industry operate in this area? What did they extract/produce?

2. What were the environmental impacts? (water pollution, deforestation, habitat loss, air pollution)

3. Are there still visible or ongoing impacts today? (abandoned mines, acid mine drainage, contaminated sites)

4. Were there any labor or community health issues related to this industry?

5. What cleanup or restoration efforts have taken place?

6. Who profited from this industry? Who paid the costs?

7. What regulations or laws were passed in response to these environmental problems?

Provide specific examples, dates, and sources.`,
    researchQuestions: [
      'What industry was dominant in your area? (Coal, steel, timber, oil/gas, agriculture)',
      'What specific environmental damage occurred? (Stream pollution, forest loss, species extinction)',
      'Are there Superfund sites or brownfields in your area?',
      'What communities were most affected by pollution or health impacts?',
      'What laws or regulations were passed because of local environmental problems?',
      'What restoration projects are ongoing? Who funds them?'
    ],
    criticalThinking: [
      'Who benefited economically from extraction? Who bore the environmental costs?',
      'Were workers aware of health risks? Were communities informed?',
      'How do corporate histories differ from community accounts?',
      'What environmental racism might have occurred? (Were polluting industries placed near minority or poor communities?)',
      'Who is responsible for cleanup? The company? Taxpayers? No one?',
      'How do industry-funded sources differ from independent research?'
    ]
  },
  {
    id: 'watershed-history',
    title: 'Your Watershed\'s Story',
    icon: '💧',
    description: 'Trace the history of your local stream, river, or watershed',
    chatGPTPrompt: `I want to research [STREAM/RIVER NAME] in Pennsylvania. Please help me understand:

1. What is the name and meaning of this waterway? (Many have Indigenous or colonial names)

2. What was the ecological condition of this stream historically vs. today?

3. What fish and wildlife lived here in 1600 vs. today?

4. What major impacts has this stream experienced? (dams, pollution, channelization, development)

5. Have there been fish kills, pollution events, or flooding disasters?

6. What restoration work has been done? Is the stream healthier today or worse?

7. What organizations or agencies are working to protect this watershed?

8. Are there any dams? When were they built? For what purpose? Are any being removed?

Provide historical context and sources.`,
    researchQuestions: [
      'What does your stream\'s name mean? (Indigenous? Colonial? Descriptive?)',
      'What species lived here historically that are now gone? (Atlantic salmon, sturgeon, eels)',
      'When was the stream most polluted? What caused it?',
      'Are there any dams? What do they do? (Flood control, power, water supply)',
      'Has the stream been restored? By whom?',
      'What\'s the water quality today? (Check DEP or USGS data)',
      'Who owns the land along the stream? Private? Public? Protected?'
    ],
    criticalThinking: [
      'How do we know what the stream was like historically? (Records, photos, oral histories)',
      'Who is responsible for stream pollution? Individual actions or systemic issues?',
      'Should dams be removed to restore fish passage? Who decides? What are the trade-offs?',
      'How do upstream actions affect downstream communities?',
      'What happens when private property rights conflict with public water quality?',
      'How do different communities value the stream? (Recreation, drinking water, habitat, property values)'
    ]
  },
  {
    id: 'current-issues',
    title: 'Current Conservation Challenges',
    icon: '⚠️',
    description: 'Research the most pressing conservation issues in your region today',
    chatGPTPrompt: `I want to understand current conservation issues in [REGION], Pennsylvania. Please help me research:

1. What are the biggest environmental threats facing this region right now? (Development, pollution, climate change, invasive species, etc.)

2. What species are endangered or declining in this area?

3. What habitat loss or degradation is occurring?

4. Are there any controversial environmental issues or conflicts? (Development vs. conservation, energy vs. environment, etc.)

5. What organizations are working on these issues? What are their positions?

6. What actions are local government or agencies taking?

7. How might climate change specifically affect this region?

8. What can individual people do to help?

Provide current data, recent news articles, and sources.`,
    researchQuestions: [
      'What development projects are proposed or underway? (Housing, roads, pipelines, solar/wind farms)',
      'What species are listed as endangered or threatened in your county?',
      'Is there controversy about land use? (Energy development, conservation, recreation)',
      'What local environmental groups are active? What are their priorities?',
      'Has climate change already affected your area? (Flooding, drought, species shifts)',
      'What environmental regulations are being debated? (Water quality, air quality, land use)',
      'What environmental justice issues exist? (Who bears pollution burdens?)'
    ],
    criticalThinking: [
      'Who has a stake in the outcome of these issues? (Developers, conservationists, residents, industries)',
      'How do different groups frame the same issue? (Jobs vs. environment, property rights vs. public good)',
      'What information sources are credible? (Peer-reviewed research, government data, advocacy groups, industry)',
      'What are the trade-offs? Is there a win-win solution?',
      'Whose voices are loudest in the debate? Whose are missing?',
      'What would you do if you were in charge? What information would you need?',
      'How do short-term interests conflict with long-term sustainability?'
    ]
  }
];

export default function LocalHistoryResearch() {
  const [selectedPrompt, setSelectedPrompt] = useState<ResearchPrompt | null>(null);
  const [showBaldEagleExample, setShowBaldEagleExample] = useState(false);

  return (
    <div className="card section" style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #FCD34D 100%)' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', color: '#78350F', marginBottom: '0.75rem' }}>
          🔍 Become a Conservation Historian
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#92400E', lineHeight: 1.6, maxWidth: '900px', margin: '0 auto' }}>
          Use AI tools like ChatGPT to uncover the hidden conservation history of YOUR community. 
          Learn to evaluate sources, think critically, and discover stories that aren&apos;t in textbooks.
        </p>
      </div>

      {/* Bald Eagle Example - Featured */}
      <div 
        className="card" 
        style={{ 
          background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
          border: '3px solid #DC2626',
          marginBottom: '2rem',
          cursor: 'pointer'
        }}
        onClick={() => setShowBaldEagleExample(!showBaldEagleExample)}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showBaldEagleExample ? '1.5rem' : '0' }}>
          <div>
            <h3 style={{ color: '#991B1B', marginBottom: '0.5rem' }}>
              🦅 Case Study: The Two Stories of Chief Bald Eagle
            </h3>
            <p style={{ color: '#7F1D1D', fontSize: '0.95rem' }}>
              Why peer-reviewed sources matter - and what they miss
            </p>
          </div>
          <div style={{ 
            fontSize: '1.5rem', 
            color: '#991B1B',
            transform: showBaldEagleExample ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.3s'
          }}>
            ▼
          </div>
        </div>

        {showBaldEagleExample && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '1rem', color: '#7F1D1D', lineHeight: 1.7, marginBottom: '1rem' }}>
                <strong>Bald Eagle State Park</strong> in Centre County is named after Chief Bald Eagle, a Lenape leader. 
                But ask different sources about how he died, and you&apos;ll get different answers:
              </p>

              <div style={{ display: 'grid', gap: '1rem' }}>
                <div className="card" style={{ background: 'white', borderLeft: '4px solid #F59E0B' }}>
                  <h4 style={{ color: '#92400E', marginBottom: '0.5rem' }}>📖 Popular/Romantic Version</h4>
                  <p style={{ color: '#374151', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    Chief Bald Eagle was a peaceful leader who was tragically murdered by a white settler in an 
                    unprovoked attack around 1780. He&apos;s remembered as a noble figure who tried to maintain peace 
                    between Indigenous peoples and settlers.
                  </p>
                  <p style={{ color: '#6B7280', fontSize: '0.85rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
                    Source: Local folklore, park signage, non-academic sources
                  </p>
                </div>

                <div className="card" style={{ background: 'white', borderLeft: '4px solid #3B82F6' }}>
                  <h4 style={{ color: '#1E40AF', marginBottom: '0.5rem' }}>📚 Peer-Reviewed Historical Research</h4>
                  <p style={{ color: '#374151', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    Academic historians studying primary sources (land deeds, court records, witness statements) 
                    found a more complex story. There were disputes over land rights, broken treaties, and economic 
                    pressures. The exact circumstances of Chief Bald Eagle&apos;s death are unclear and involve legal 
                    conflicts, not just a simple murder. Some accounts suggest he may have died in conflict over 
                    contested territory.
                  </p>
                  <p style={{ color: '#6B7280', fontSize: '0.85rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
                    Source: Academic journals, primary colonial documents, legal records
                  </p>
                </div>

                <div className="card" style={{ background: 'white', borderLeft: '4px solid #10B981' }}>
                  <h4 style={{ color: '#065F46', marginBottom: '0.5rem' }}>🪶 Indigenous Oral Histories</h4>
                  <p style={{ color: '#374151', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    Lenape descendants have their own accounts passed down through generations. These may include 
                    cultural context, family relationships, and details about Chief Bald Eagle&apos;s life that 
                    colonial documents never recorded. Oral histories often preserve perspectives that written 
                    records miss.
                  </p>
                  <p style={{ color: '#6B7280', fontSize: '0.85rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
                    Source: Lenape oral traditions, Indigenous historians
                  </p>
                </div>

                <div className="card" style={{ background: 'white', borderLeft: '4px solid #8B5CF6' }}>
                  <h4 style={{ color: '#5B21B6', marginBottom: '0.5rem' }}>🏘️ Local Settler Folklore</h4>
                  <p style={{ color: '#374151', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    Stories passed down in the settler community may romanticize pioneers, vilify Indigenous peoples, 
                    or create dramatic narratives that served social purposes (justifying land takings, creating local 
                    legends, etc.). These often lack documentation but reflect how communities understood events.
                  </p>
                  <p style={{ color: '#6B7280', fontSize: '0.85rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
                    Source: Family stories, community legends, undocumented oral tradition
                  </p>
                </div>
              </div>
            </div>

            <div style={{ background: '#FEF3C7', border: '2px solid #F59E0B', borderRadius: '12px', padding: '1.5rem' }}>
              <h4 style={{ color: '#92400E', marginBottom: '1rem' }}>💡 What This Teaches Us:</h4>
              <ul style={{ paddingLeft: '1.5rem', lineHeight: 2, color: '#78350F' }}>
                <li><strong>Peer-reviewed sources are important</strong> because they cite primary documents and are fact-checked by other experts</li>
                <li><strong>BUT written records have bias</strong> - Who had the power to write? Whose perspective was recorded?</li>
                <li><strong>Multiple sources tell richer stories</strong> - Academic + Indigenous + oral history = fuller picture</li>
                <li><strong>Some questions can&apos;t be fully answered</strong> - History often involves uncertainty and conflicting accounts</li>
                <li><strong>The way we tell history matters</strong> - It shapes how we understand the present and make future decisions</li>
                <li><strong>Good historians acknowledge what they don&apos;t know</strong> - Be skeptical of anyone claiming perfect certainty about the past</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Research Prompts */}
      {selectedPrompt ? (
        <div>
          <button 
            onClick={() => setSelectedPrompt(null)}
            className="btn-outline"
            style={{ marginBottom: '1.5rem' }}
          >
            ← Back to All Research Topics
          </button>

          <div className="card" style={{ background: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '3rem' }}>{selectedPrompt.icon}</div>
              <div>
                <h3 style={{ color: '#023047', marginBottom: '0.25rem' }}>{selectedPrompt.title}</h3>
                <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>{selectedPrompt.description}</p>
              </div>
            </div>

            {/* ChatGPT Prompt */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ color: '#059669', marginBottom: '1rem' }}>📋 Copy This Prompt for ChatGPT:</h4>
              <div style={{ 
                background: '#F3F4F6', 
                padding: '1.5rem', 
                borderRadius: '8px',
                border: '2px dashed #059669',
                position: 'relative'
              }}>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedPrompt.chatGPTPrompt);
                    alert('Prompt copied! Paste it into ChatGPT.');
                  }}
                  className="btn"
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: '#059669',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    fontSize: '0.9rem'
                  }}
                >
                  📋 Copy
                </button>
                <pre style={{ 
                  whiteSpace: 'pre-wrap', 
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  color: '#1F2937',
                  margin: 0,
                  paddingRight: '6rem'
                }}>
                  {selectedPrompt.chatGPTPrompt}
                </pre>
              </div>
              <p style={{ color: '#6B7280', fontSize: '0.85rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
                💡 Tip: Replace the [BRACKETED TEXT] with your specific location or details
              </p>
            </div>

            {/* Research Questions */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ color: '#0077B6', marginBottom: '1rem' }}>🔍 Guiding Questions:</h4>
              <div style={{ background: '#F0F9FF', padding: '1.5rem', borderRadius: '12px' }}>
                <ul style={{ paddingLeft: '1.5rem', lineHeight: 2, color: '#0C4A6E' }}>
                  {selectedPrompt.researchQuestions.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Critical Thinking */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ color: '#DC2626', marginBottom: '1rem' }}>🤔 Think Critically About Sources:</h4>
              <div style={{ background: '#FEF2F2', padding: '1.5rem', borderRadius: '12px' }}>
                <ul style={{ paddingLeft: '1.5rem', lineHeight: 2, color: '#7F1D1D' }}>
                  {selectedPrompt.criticalThinking.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* PA Example if exists */}
            {selectedPrompt.paExample && (
              <div style={{ background: '#FFF7ED', border: '2px solid #F59E0B', padding: '1.5rem', borderRadius: '12px' }}>
                <h4 style={{ color: '#92400E', marginBottom: '0.75rem' }}>
                  🗺️ Pennsylvania Example: {selectedPrompt.paExample.location}
                </h4>
                <p style={{ color: '#78350F', marginBottom: '1rem', lineHeight: 1.6 }}>
                  {selectedPrompt.paExample.story}
                </p>
                <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                  {selectedPrompt.paExample.conflictingAccounts.map((account, idx) => (
                    <p key={idx} style={{ color: '#374151', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: idx < selectedPrompt.paExample!.conflictingAccounts.length - 1 ? '0.75rem' : '0' }}>
                      {account}
                    </p>
                  ))}
                </div>
                <div style={{ background: '#DBEAFE', padding: '1rem', borderRadius: '8px' }}>
                  <strong style={{ color: '#1E40AF' }}>Lesson:</strong>
                  <p style={{ color: '#1E3A8A', marginTop: '0.5rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    {selectedPrompt.paExample.lesson}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3 style={{ color: '#78350F', marginBottom: '1rem' }}>Choose a Research Topic:</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {RESEARCH_PROMPTS.map((prompt) => (
              <div
                key={prompt.id}
                className="card"
                onClick={() => setSelectedPrompt(prompt)}
                style={{
                  background: 'white',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>
                  {prompt.icon}
                </div>
                <h4 style={{ color: '#023047', marginBottom: '0.75rem', textAlign: 'center' }}>
                  {prompt.title}
                </h4>
                <p style={{ color: '#4B5563', fontSize: '0.95rem', lineHeight: 1.6, textAlign: 'center', marginBottom: '1rem' }}>
                  {prompt.description}
                </p>
                <button 
                  className="btn"
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    color: 'white'
                  }}
                >
                  Start Research →
                </button>
              </div>
            ))}
          </div>

          {/* Tips Section */}
          <div className="card" style={{ background: 'white', marginTop: '2rem' }}>
            <h3 style={{ color: '#059669', marginBottom: '1rem' }}>💡 Research Tips:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: '#F0FDF4', borderRadius: '8px' }}>
                <strong style={{ color: '#065F46' }}>✅ Use ChatGPT to START</strong>
                <p style={{ color: '#047857', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  AI is great for finding starting points, questions to ask, and connections to explore
                </p>
              </div>
              <div style={{ padding: '1rem', background: '#FEF3C7', borderRadius: '8px' }}>
                <strong style={{ color: '#92400E' }}>📚 Verify with Real Sources</strong>
                <p style={{ color: '#78350F', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Always check AI answers against actual sources: library archives, historical societies, peer-reviewed papers
                </p>
              </div>
              <div style={{ padding: '1rem', background: '#F0F9FF', borderRadius: '8px' }}>
                <strong style={{ color: '#0C4A6E' }}>🗣️ Talk to People</strong>
                <p style={{ color: '#075985', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Interview elders, local historians, Indigenous community members, park rangers, conservation workers
                </p>
              </div>
              <div style={{ padding: '1rem', background: '#FEE2E2', borderRadius: '8px' }}>
                <strong style={{ color: '#991B1B' }}>❓ Question Everything</strong>
                <p style={{ color: '#7F1D1D', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Who wrote this? Why? What might they have left out? Whose perspective is missing?
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

