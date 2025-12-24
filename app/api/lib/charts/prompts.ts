import { ChartKey } from "./keys";

const D1_PROMPT = `You are an expert Vedic astrologer. Analyze the D1 (Natal/Rasi) chart data provided and create a comprehensive summary.

Focus on:
- Key planetary positions, signs, houses, and nakshatras
- Planetary strengths (Shadbala) and dignities (exalted, debilitated, etc.)
- Important house placements and their lords
- Major aspects and conjunctions between planets
- House lordships and their placements
- Overall chart strengths and challenges
- Key life areas indicated by the chart

Format the summary as structured text that an astro LLM can easily parse. Be comprehensive but organized, highlighting the most significant astrological factors in the natal chart.

Chart Data:
{chartData}`;

const D9_PROMPT = `You are an expert Vedic astrologer. Analyze the D9 (Navamsa) chart data provided and create a comprehensive summary.

Focus on:
- Relationship and marriage indicators
- Spiritual evolution and inner nature
- Planetary strengthening or weakening compared to D1
- Key planetary positions in Navamsa
- Important aspects and conjunctions in Navamsa
- How planets behave differently in Navamsa vs D1
- Relationship dynamics and partnership indicators

Format the summary as structured text that an astro LLM can easily parse. Be comprehensive but organized, highlighting the most significant astrological factors in the Navamsa chart, especially as they relate to relationships and spiritual growth.

Chart Data:
{chartData}`;

const D10_PROMPT = `You are an expert Vedic astrologer. Analyze the D10 (Dashamsa) chart data provided and create a comprehensive summary.

Focus on:
- Career and profession indicators
- Public life and reputation factors
- Professional strengths and opportunities
- Planetary movements and positions in Dashamsa
- How planets behave in career context vs D1
- Important house placements for career
- Key aspects affecting professional life
- Career-related planetary periods to watch

Format the summary as structured text that an astro LLM can easily parse. Be comprehensive but organized, highlighting the most significant astrological factors in the Dashamsa chart, especially as they relate to career, profession, and public life.

Chart Data:
{chartData}`;

const GENERIC_CHART_PROMPT = `You are an expert Vedic astrologer. Analyze the chart data provided and create a comprehensive summary.

Focus on:
- Key planetary positions and their significance
- Important house placements
- Major aspects and conjunctions
- Overall chart strengths and challenges
- Key astrological factors and their implications

Format the summary as structured text that an astro LLM can easily parse. Be comprehensive but organized, highlighting the most significant astrological factors.

Chart Data:
{chartData}`;

const DASHA_PROMPT = `You are an expert Vedic astrologer. Analyze the dasha (planetary period) data provided and create a comprehensive summary.

Focus on:
- Current planetary periods (mahadasha, antardasha, pratyantardasha)
- Upcoming periods and their significance
- Timing of important events
- Planetary influences during different periods
- Recommendations for each period

Format the summary as structured text that an astro LLM can easily parse. Be comprehensive but organized, highlighting the most significant timing factors.

Chart Data:
{chartData}`;

const ASHTAKAVARGA_PROMPT = `You are an expert Vedic astrologer. Analyze the Ashtakavarga data provided and create a comprehensive summary.

Focus on:
- Overall strength indicators
- House-wise strength analysis
- Planetary contributions
- Key strengths and weaknesses
- Recommendations based on Ashtakavarga

Format the summary as structured text that an astro LLM can easily parse. Be comprehensive but organized.

Chart Data:
{chartData}`;

const PANCHANGA_PROMPT = `You are an expert Vedic astrologer. Analyze the Panchanga (five elements of time) data provided and create a comprehensive summary.

Focus on:
- Tithi (lunar day) significance
- Nakshatra (lunar mansion) influence
- Yoga (planetary combination) effects
- Karana (half lunar day) implications
- Vaara (weekday) influences

Format the summary as structured text that an astro LLM can easily parse. Be comprehensive but organized.

Chart Data:
{chartData}`;

/**
 * Gets the appropriate prompt for a chart key
 */
export function getPromptForKey(key: ChartKey): string {
  switch (key) {
    case ChartKey.D1:
      return D1_PROMPT;
    case ChartKey.D9:
      return D9_PROMPT;
    case ChartKey.D10:
      return D10_PROMPT;
    case ChartKey.DASHA:
      return DASHA_PROMPT;
    case ChartKey.ASHTAKAVARGA:
      return ASHTAKAVARGA_PROMPT;
    case ChartKey.PANCHANGA:
      return PANCHANGA_PROMPT;
    default:
      return GENERIC_CHART_PROMPT;
  }
}
