import streamlit as st
import pandas as pd
import plotly.express as px
from streamlit_option_menu import option_menu

# 1. Page Configuration
st.set_page_config(
    page_title="Campus Analytics Pro", 
    layout="wide", 
    page_icon="⚡",
    initial_sidebar_state="expanded"
)

# 2. Custom CSS for Styling
st.markdown("""
    <style>
    /* Metric Card Styling */
    div[data-testid="stMetric"] {
        background-color: #1e2130;
        border: 1px solid #2d3250;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        transition: transform 0.2s ease, border-color 0.2s ease;
    }
    div[data-testid="stMetric"]:hover {
        transform: translateY(-2px);
        border-color: #4f46e5;
    }
    div[data-testid="stMetricLabel"] {
        font-size: 0.9rem !important;
        color: #9ca3af !important;
        font-weight: 500;
    }
    div[data-testid="stMetricValue"] {
        font-size: 1.8rem !important;
        color: #ffffff !important;
        font-weight: 700;
    }
    
    /* Main Background Tweaks */
    .stApp {
        background-color: #0e1117;
    }
    </style>
""", unsafe_allow_html=True)

# 3. Load Data with Caching
@st.cache_data
def load_data():
    return pd.read_csv("campus_data.csv")

try:
    df = load_data()

    # 4. Top Navigation Bar
    selected_tab = option_menu(
        menu_title=None,
        options=["Overview Dashboard", "Student Explorer", "Department Insights"],
        icons=["speedometer2", "people", "bar-chart-line"],
        default_index=0,
        orientation="horizontal",
        styles={
            "container": {"padding": "0!important", "background-color": "#161b26", "border-radius": "10px"},
            "icon": {"color": "#6366f1", "font-size": "16px"},
            "nav-link": {
                "font-size": "15px",
                "text-align": "center",
                "margin": "4px",
                "color": "#9ca3af",
                "border-radius": "8px",
            },
            "nav-link-selected": {"background-color": "#4f46e5", "color": "#ffffff", "font-weight": "600"},
        }
    )

    st.write("") # Spacing

    # 5. Sidebar Filters
    st.sidebar.image("https://img.icons8.com/isometric-reflection/100/graduation-cap.png", width=70)
    st.sidebar.title("Filter Panel")
    
    branches = ["All"] + list(df["Branch"].unique())
    selected_branch = st.sidebar.selectbox("🎯 Target Department", branches)

    cgpa_range = st.sidebar.slider(
        "📊 CGPA Filter Range",
        min_value=float(df["CGPA"].min()),
        max_value=float(df["CGPA"].max()),
        value=(float(df["CGPA"].min()), float(df["CGPA"].max()))
    )

    # Apply Filters
    filtered_df = df[
        (df["CGPA"] >= cgpa_range[0]) & 
        (df["CGPA"] <= cgpa_range[1])
    ]
    if selected_branch != "All":
        filtered_df = filtered_df[filtered_df["Branch"] == selected_branch]

    # --- TAB 1: OVERVIEW DASHBOARD ---
    if selected_tab == "Overview Dashboard":
        # Metric Cards
        col1, col2, col3, col4 = st.columns(4)
        col1.metric("Total Students", len(filtered_df))
        col2.metric("Average CGPA", f"{filtered_df['CGPA'].mean():.2f}")
        col3.metric("Avg LeetCode Solved", f"{int(filtered_df['LeetCode_Solved'].mean()) if len(filtered_df)>0 else 0}")
        
        placed_count = len(filtered_df[filtered_df['Internship_Status'] == 'Placed'])
        placement_rate = (placed_count / len(filtered_df)) * 100 if len(filtered_df) > 0 else 0
        col4.metric("Placement Rate", f"{placement_rate:.1f}%")

        st.divider()

        # Charts Section
        col_chart1, col_chart2 = st.columns([1.2, 1])

        with col_chart1:
            st.subheader("🚀 Academics vs. Problem Solving")
            fig_scatter = px.scatter(
                filtered_df, 
                x="CGPA", 
                y="LeetCode_Solved", 
                color="Internship_Status",
                hover_name="Name",
                size="CodeChef_Rating",
                template="plotly_dark",
                color_discrete_sequence=["#10b981", "#ef4444", "#f59e0b"]
            )
            fig_scatter.update_layout(
                paper_bgcolor="rgba(0,0,0,0)",
                plot_bgcolor="rgba(0,0,0,0)",
                margin=dict(l=20, r=20, t=30, b=20)
            )
            st.plotly_chart(fig_scatter, use_container_width=True)

        with col_chart2:
            st.subheader("🍩 Placement Breakdown")
            fig_pie = px.pie(
                filtered_df, 
                names="Internship_Status", 
                hole=0.5,
                template="plotly_dark",
                color_discrete_sequence=px.colors.qualitative.Pastel
            )
            fig_pie.update_layout(
                paper_bgcolor="rgba(0,0,0,0)",
                plot_bgcolor="rgba(0,0,0,0)",
                margin=dict(l=20, r=20, t=30, b=20)
            )
            st.plotly_chart(fig_pie, use_container_width=True)

    # --- TAB 2: STUDENT EXPLORER ---
    elif selected_tab == "Student Explorer":
        st.subheader("📋 Detailed Student Records")
        search_query = st.text_input("🔍 Search Student by Name", "")
        
        display_df = filtered_df
        if search_query:
            display_df = filtered_df[filtered_df["Name"].str.contains(search_query, case=False, na=False)]
            
        st.dataframe(
            display_df, 
            use_container_width=True,
            hide_index=True
        )

    # --- TAB 3: DEPARTMENT INSIGHTS ---
    elif selected_tab == "Department Insights":
        st.subheader("🏢 Branch Performance Comparison")
        
        branch_summary = df.groupby("Branch").agg({
            "CGPA": "mean",
            "LeetCode_Solved": "mean",
            "CodeChef_Rating": "mean"
        }).reset_index()

        fig_bar = px.bar(
            branch_summary,
            x="Branch",
            y="LeetCode_Solved",
            color="Branch",
            title="Average Problems Solved per Department",
            template="plotly_dark"
        )
        fig_bar.update_layout(
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)"
        )
        st.plotly_chart(fig_bar, use_container_width=True)

except FileNotFoundError:
    st.error("⚠️ Error: 'campus_data.csv' not found. Run 'python create_csv.py' first!")
