# create restrcution options, choose from random 
# have user ids choose from random following/followers, etc.
# use some of mock data
import pandas as pd
import random

restrictions = ['vegetarian', 'gluten free', 'vegan', 'keto', 'low calorie']
user_dict = []
min_num = 0 # Minimum value of review id
max_num = 10000  # Maximum value of review id
min_size = 0  # Minimum size of the amount of reviews 
max_size = 50  # Maximum size of the amount of reviews

def generate_user_data():
    df = pd.read_csv("backend/cmd/db/script/mock_user_data.csv")
    print(len(df))
    for index, row in df.iterrows():
       user_entry = {}
       user_entry['username'] = row['username']
       user_entry['password'] = row['password']
       list_size = random.randint(min_size, max_size)
       random_list = list(set([random.randint(min_num, max_num) for _ in range(list_size)]))
       user_entry['reviews'] = random_list
       list_size = random.randint(min_size, max_size)
       list_size = random.randint(0, 4)
       preferences_idx_list = list(set([random.randint(0, 4) for _ in range(list_size)]))
       user_entry['preferences'] = {}
       preferences_list = []
       for idx in preferences_idx_list:
           preferences_list.append(restrictions[idx])
       user_entry['preferences']['restrictions'] = preferences_list
       user_entry['following'] = list(set([random.randint(min_num, max_num) for _ in range(list_size)]))
       user_entry['followingCount'] = len(user_entry['following'])
       list_size = random.randint(min_size, max_size)
       user_entry['followers'] = list(set([random.randint(min_num, max_num) for _ in range(list_size)]))
       user_entry['followersCount'] = len(user_entry['followers'])
       user_entry['profile_picture'] = ""
       user_dict.append(user_entry)
    return user_dict