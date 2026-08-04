import streamlit as st
import pandas as pd
import plotly.express as px

st.set_page_config(page_title="Campus Analytics Dashboard", layout="wide", page_icon="??")
st.title("?? Department Coding & Performance Analytics")
st.markdown("An interactive overview of student academic performance and coding stats.")
st.divider()

@st.cache_data
def load_data():
return pd.read_csv("campus_data.csv")

try:
df = load_data()
st.sidebar.header("Filter Options")
branches = ["All"] + list(df["Branch"].unique())
selected_branch = st.sidebar.selectbox("Select Department/Branch", branches)

filtered_df = df if selected_branch == "All" else df[df["Branch"] == selected_branch]

col1, col2, col3, col4 = st.columns(4)
col1.metric("Total Students", len(filtered_df))
col2.metric("Average CGPA", f"{filtered_df['CGPA'].mean():.2f}")
col3.metric("Avg LeetCode Solved", f"{int(filtered_df['LeetCode_Solved'].mean())}")

placed_count = len(filtered_df[filtered_df['Internship_Status'] == 'Placed'])
col4.metric("Placement Rate", f"{(placed_count / len(filtered_df)) * 100:.1f}%")

st.divider()
col_chart1, col_chart2 = st.columns(2)

with col_chart1:
    st.subheader("CGPA vs. LeetCode Solved")
    fig_scatter = px.scatter(
        filtered_df, x="CGPA", y="LeetCode_Solved",
        color="Internship_Status", hover_name="Name",
        size="CodeChef_Rating", title="Academics vs. Problem Solving"
    )
    st.plotly_chart(fig_scatter, use_container_width=True)

with col_chart2:
    st.subheader("Placement Distribution")
    fig_pie = px.pie(filtered_df, names="Internship_Status", title="Overall Status", hole=0.4)
    st.plotly_chart(fig_pie, use_container_width=True)

with st.expander("?? View Raw Dataset"):
    st.dataframe(filtered_df)

except FileNotFoundError:
st.error("Error: 'campus_data.csv' not found. Run create_csv.py first!")
