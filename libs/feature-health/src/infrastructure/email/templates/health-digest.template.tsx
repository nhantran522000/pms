import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Hr,
  Preview,
} from '@react-email/components';

/**
 * Week summary statistics for the health digest email
 */
interface WeekSummary {
  weightEntries: number;
  workoutCount: number;
  avgSleepHours: number;
  loggingStreak: number;
}

/**
 * Props for the HealthDigestTemplate component
 */
export interface HealthDigestTemplateProps {
  /** User's display name */
  userName: string;
  /** End date of the week (formatted string) */
  weekEnd: string;
  /** AI-generated insights about the week's health data */
  insights: string[];
  /** AI-generated recommendations for improvement */
  recommendations: string[];
  /** Summary statistics for the week */
  weekSummary: WeekSummary;
  /** URL for one-click unsubscribe */
  unsubscribeUrl: string;
}

/**
 * React Email template for weekly health digest
 * Renders to HTML for delivery via Resend
 */
export default function HealthDigestTemplate({
  userName,
  weekEnd,
  insights,
  recommendations,
  weekSummary,
  unsubscribeUrl,
}: HealthDigestTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>Your weekly health insights for {weekEnd}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your Weekly Health Digest</Heading>

          <Text style={greeting}>Hi {userName},</Text>

          <Text style={paragraph}>
            Here's your health summary for the week ending {weekEnd}:
          </Text>

          <Section style={statsSection}>
            <Text style={statText}>
              <strong>{weekSummary.weightEntries}</strong> weight entries
            </Text>
            <Text style={statText}>
              <strong>{weekSummary.workoutCount}</strong> workouts logged
            </Text>
            <Text style={statText}>
              <strong>{weekSummary.avgSleepHours.toFixed(1)}</strong> avg sleep hours
            </Text>
            <Text style={statText}>
              <strong>{weekSummary.loggingStreak}</strong> day logging streak
            </Text>
          </Section>

          {insights.length > 0 && (
            <>
              <Hr style={hr} />
              <Heading style={h2}>Insights</Heading>
              {insights.map((insight, i) => (
                <Text key={i} style={paragraph}>
                  {insight}
                </Text>
              ))}
            </>
          )}

          {recommendations.length > 0 && (
            <>
              <Hr style={hr} />
              <Heading style={h2}>Recommendations</Heading>
              {recommendations.map((rec, i) => (
                <Text key={i} style={paragraph}>
                  {rec}
                </Text>
              ))}
            </>
          )}

          <Hr style={hr} />

          <Text style={footer}>
            Keep up the great work tracking your health!
            <br />
            <a href={unsubscribeUrl} style={unsubscribeLink}>
              Unsubscribe from weekly digest
            </a>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Email styles - inline for React Email compatibility
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'system-ui, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const h1 = {
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 16px',
  color: '#1a1a1a',
};

const h2 = {
  fontSize: '18px',
  fontWeight: '600',
  margin: '24px 0 12px',
  color: '#1a1a1a',
};

const greeting = {
  fontSize: '16px',
  margin: '0 0 12px',
  color: '#374151',
};

const paragraph = {
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 12px',
  color: '#374151',
};

const statsSection = {
  backgroundColor: '#eef2ff',
  padding: '16px',
  borderRadius: '8px',
  margin: '16px 0',
};

const statText = {
  fontSize: '14px',
  margin: '4px 0',
  color: '#374151',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  fontSize: '12px',
  color: '#8898aa',
  margin: '24px 0 0',
};

const unsubscribeLink = {
  color: '#8898aa',
  textDecoration: 'underline',
};
