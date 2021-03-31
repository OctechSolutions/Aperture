import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json
from datetime import datetime, timedelta

cred = credentials.Certificate("./zeta-range-302607-firebase-adminsdk-8idhm-2a42541c3c.json")
firebase_admin.initialize_app(cred, {
  'projectId': "zeta-range-302607",
})

db = firestore.client()
# For users
docs = db.collection(u'users').order_by(u'profilePoints', direction=firestore.Query.DESCENDING).stream()
rank = 1
users = []
for doc in docs :
  userData = doc.to_dict()
  userId = userData["name"]
  if(rank==1):
    if(userData[u"league"] != u"Champion" and userData[u"profilePoints"] != 0):
      db.collection(u"users").document(userId).update({u"league" : u"Champion", u"notifyLeague": True, u"leagueStatus": u"p"})
      userData.update({u"league" : u"Champion", u"notifyLeague": True, u"leagueStatus": u"p"})
  elif(rank>1 and rank < 11):
    if(userData[u"league"] != u"Legendary" and userData[u"profilePoints"] != 0):
      db.collection(u"users").document(userId).update({u"league" : u"Legendary", u"notifyLeague": True, u"leagueStatus": "d" if userData[u"league"] == u"Champion" else "p"})
      userData.update({u"league" : u"Legendary", u"notifyLeague": True, u"leagueStatus": "d" if userData[u"league"] == u"Champion" else "p" })
  
  userData.update({u"rank" : rank})
  rank +=1
  user = {u"id" : userId , u"data" : userData}
  users.append(user)  
      
db.collection(u"globalLeaderBoards").document(u"userLeaderBoard").update({u"users":users})
# For Posts
docsP = db.collection(u'posts').order_by(u'totalStars', direction=firestore.Query.DESCENDING).limit(10).stream()
posts = []
postRank = 1
for doc in docsP :
  postData = doc.to_dict()
  postId = doc.id
  postData.update({u"rank" : postRank})
  postRank +=1
  post = {u"id" : postId , u"data" : postData}
  posts.append(post)  
      
db.collection(u"globalLeaderBoards").document(u"postLeaderBoard").update({u"posts":posts})

#Challenges
docsC = db.collection(u'challenges').stream()
currentDate = datetime.now().date()
for doc in docsC :
  challengeData = doc.to_dict()
  challengeId = doc.id
  challengeDate = challengeData["endTimeStamp"].date()
  if(challengeDate < currentDate):
    if(challengeData["ended"]==False):
      challengeData.update({u"ended" : True})
      db.collection(u"challenges").document(challengeId).update({u"ended" : True})
      top3Users = sorted(challengeData["participants"], key=lambda x: x["challengePoints"], reverse=True)[:3]
      transaction = db.transaction()
      @firestore.transactional
      def update_in_transaction(transaction,points,name):
        userRef = db.collection(u"users").document(name)
        user = userRef.get(transaction=transaction)
        transaction.update(userRef, {u'profilePoints': user.get(u'profilePoints') + points})
      if(len(top3Users)>0):
        #Will get extra 100 points    
        update_in_transaction(transaction,100,top3Users[0]["displayName"])
      if(len(top3Users)>1):
        #Will get extra 50 points    
        update_in_transaction(transaction,50,top3Users[1]["displayName"])
      if(len(top3Users)>2):
        #Will get extra 25 points    
        update_in_transaction(transaction,25,top3Users[2]["displayName"])
    elif(challengeDate +timedelta(days = 2) < currentDate):
      db.collection(u"challenges").document(challengeId).delete()
      # Delete the challenge posts 
      challengePosts = db.collection(u"challengePosts").where(u"challenge", u"==", challengeId).stream()
      for post in challengePosts:
        db.collection(u"challengePosts").document(post.id).delete() 
        db.collection(u"posts").document(post.id).update({
          u"challenge": firebase.firestore.FieldValue.delete()
        })


#For seasons
month = datetime.now()
endMonth = (datetime.now() +timedelta(days= 90)) #After 90 days
season = db.collection(u'seasons').document(u"currentSeason").get().to_dict()
if(month.date() >= season[u"endMonth"].date()):
    db.collection(u'seasons').document(u"currentSeason").set({
        u"startMonth": month,
        u"endMonth"  : endMonth,
        u"seasonNo" : season[u"seasonNo"] +1
    })
    users = db.collection(u'users').stream()
    champion = {}
    legends = []
    for user in users:
        userData = user.to_dict()
        userId = user.id
        badge = userData[u"league"]
        badges = userData[u"badges"]
        if badge == "Champion":
          champion = userData
        if badge == "Legendary" :
          legends.append(userData)
        db.collection(u'users').document(userData["name"]).update({
            u"badges" :[u"Season "+ str(season["seasonNo"]) + " "+ badge] + badges ,
            u"profilePoints" : 0,
            u"league" : "No league profile points less than 100"
        })
        season["champion"] = champion
        season["legends"] = legends
    db.collection(u'seasons').document(u"season"+ str(season["seasonNo"])).set(season)

# For channels
docs = db.collection(u'channels').stream()
channels = []
rank = 1
for doc in docs :
    channelData = doc.to_dict()
    channelId = doc.id
    channelData.update({u"id":channelId})
    try :
        channelData[u"lastMonthFollowers"]
    except KeyError:
        channelData[u"lastMonthFollowers"]=0
    channelData.update({u"newFollowers" :len(channelData[u"followers"]) - channelData[u"lastMonthFollowers"]})
    added =False
    if len(channels)==0:
        channels.append(channelData)
        added = True
    else:
        for x in range(len(channels)):
            if(channels[x][u"newFollowers"] <= channelData[u"newFollowers"]):
                channels.insert(x,channelData)
                added = True
                break
        if(added == False):
            channels.append(channelData)

for x in range(len(channels)):
    channels[x].update({u"rank":x+1})
db.collection(u"globalLeaderBoards").document(u"channelLeaderBoard").update({u"channels":channels})

