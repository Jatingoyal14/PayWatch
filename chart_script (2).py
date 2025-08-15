import plotly.graph_objects as go
import json

# Load the data
data = {"skills": [{"skill": "API Integration & Testing", "level": 9}, {"skill": "Database Query & Analysis", "level": 8}, {"skill": "System Monitoring & Alerting", "level": 9}, {"skill": "Payment Gateway Knowledge", "level": 9}, {"skill": "Problem-solving & Debugging", "level": 8}, {"skill": "Customer Support Workflows", "level": 8}, {"skill": "Documentation & Reporting", "level": 7}, {"skill": "Real-time Data Processing", "level": 8}, {"skill": "UI/UX Development", "level": 8}, {"skill": "Error Handling & Troubleshooting", "level": 9}]}

# Extract skills and levels
skills = [item["skill"] for item in data["skills"]]
levels = [item["level"] for item in data["skills"]]

# Abbreviate skill names to 15 characters max
abbreviated_skills = [
    "API Integ & Test",
    "DB Query & Anal", 
    "Sys Mon & Alert",
    "Payment Gateway",
    "Problem & Debug",
    "Cust Support",
    "Doc & Reporting",
    "Real-time Data",
    "UI/UX Dev",
    "Error & Debug"
]

# Close the radar chart by adding the first point at the end
levels_closed = levels + [levels[0]]
abbreviated_skills_closed = abbreviated_skills + [abbreviated_skills[0]]

# Create the radar chart
fig = go.Figure()

fig.add_trace(go.Scatterpolar(
    r=levels_closed,
    theta=abbreviated_skills_closed,
    fill='toself',
    fillcolor='rgba(31, 184, 205, 0.3)',  # #1FB8CD with transparency
    line=dict(color='#1FB8CD', width=3),
    marker=dict(color='#1FB8CD', size=8),
    name='Skill Level',
    cliponaxis=False
))

# Update layout
fig.update_layout(
    title="Skills Demonstrated by PayWatch Project",
    polar=dict(
        radialaxis=dict(
            visible=True,
            range=[0, 10],
            tickvals=[0, 2, 4, 6, 8, 10],
            ticktext=['0', '2', '4', '6', '8', '10']
        )
    ),
    showlegend=False
)

# Save the chart
fig.write_image("paywatch_skills_radar.png")
print("Chart saved successfully!")